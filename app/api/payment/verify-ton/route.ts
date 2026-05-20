import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VPN_PRICING } from '@/lib/pricing'
import { Address, Cell } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET!

export async function POST(req: Request) {
  try {
    const { paymentId, boc } = await req.json()

    if (!paymentId || !boc) {
      return NextResponse.json({ ok: false, error: 'Missing paymentId or boc' })
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) return NextResponse.json({ ok: false, error: 'Payment not found' })
    if (payment.currency !== 'TON') return NextResponse.json({ ok: false, error: 'Wrong currency' })
    if (payment.status === 'PAID') return NextResponse.json({ ok: true, verified: true })

    // Compute external message hash from BOC returned by sendTransaction
    const msgHash = Buffer.from(Cell.fromBase64(boc).hash()).toString('hex')

    const tonapiRes = await fetch(
      `https://tonapi.io/v2/blockchain/messages/${msgHash}/transaction`,
      { headers: tonapiHeaders(), cache: 'no-store' }
    )

    // 404 means the transaction is not yet indexed — caller should retry
    if (tonapiRes.status === 404) {
      return NextResponse.json({ ok: true, verified: false, pending: true })
    }
    if (!tonapiRes.ok) {
      return NextResponse.json({ ok: true, verified: false, pending: true })
    }

    const tx = await tonapiRes.json()
    const pricing = VPN_PRICING[payment.plan]
    const paymentWalletRaw = Address.parse(PAYMENT_WALLET).toRawString()
    const expectedSenderRaw = Address.parse(payment.wallet).toRawString()

    // The external message is processed by the sender's wallet contract.
    // tx.account is that wallet — verify it matches the payment's registered wallet.
    const actualSenderRaw = (() => {
      try {
        return Address.parse(tx.account?.address ?? '').toRawString()
      } catch {
        return null
      }
    })()

    if (actualSenderRaw !== expectedSenderRaw) {
      return NextResponse.json({
        ok: false,
        error: 'Transaction sender does not match payment wallet',
      })
    }

    // Find the outgoing internal message directed at our payment wallet
    const outMsg = (tx.out_msgs ?? []).find((msg: any) => {
      try {
        return Address.parse(msg.destination?.address ?? '').toRawString() === paymentWalletRaw
      } catch {
        return false
      }
    })

    if (!payment.amountToken || payment.amountToken === '0') {
      return NextResponse.json({ ok: false, error: 'Payment has no locked amount — recreate payment' })
    }

    if (!outMsg || BigInt(outMsg.value ?? '0') < BigInt(payment.amountToken)) {
      return NextResponse.json({
        ok: true,
        verified: false,
        error: 'Wrong destination or insufficient amount',
      })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + pricing.days)

    let paymentJustPaid = false

    await prisma.$transaction(async (tx) => {
      // updateMany with status: 'PENDING' is an atomic CAS — only one concurrent
      // request will get count === 1; the rest see count === 0 and skip.
      const updated = await tx.payment.updateMany({
        where: { id: payment.id, status: 'PENDING' },
        data: { status: 'PAID', paidAt: new Date(), txHash: msgHash },
      })

      if (updated.count === 0) return

      paymentJustPaid = true

      await tx.subscription.create({
        data: {
          wallet: payment.wallet,
          plan: payment.plan,
          currency: payment.currency,
          paymentId: payment.id,
          expiresAt,
        },
      })
    })

    if (paymentJustPaid) {
      try {
        const purchaser = await prisma.user.findUnique({
          where: { wallet: payment.wallet },
          select: { id: true, referrerId: true, referrer: { select: { id: true, bonusYearGranted: true } } },
        })

        if (purchaser?.referrerId && purchaser.referrer) {
          const earningTon = Number(payment.amountToken) / 1e9 * 0.1

          await prisma.referralEarning.create({
            data: {
              userId: purchaser.referrerId,
              referralId: purchaser.id,
              paymentId: payment.id,
              amountTon: earningTon,
              status: 'available',
            },
          }).catch(e => console.error('[referral] earning skip:', e.message))

          const paidRefCount = await prisma.user.count({
            where: { referrerId: purchaser.referrerId, payments: { some: { status: 'PAID' } } },
          })

          if (paidRefCount >= 5 && !purchaser.referrer.bonusYearGranted) {
            await prisma.user.update({
              where: { id: purchaser.referrerId },
              data: { bonusYearGranted: true },
            })
            console.log(`[referral] bonus year unlocked for ${purchaser.referrerId}`)
          }
        }
      } catch (e) {
        console.error('[referral] ton earning error:', e)
      }
    }

    return NextResponse.json({ ok: true, verified: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Server error' })
  }
}
