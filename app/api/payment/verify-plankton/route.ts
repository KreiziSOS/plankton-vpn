import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VPN_PRICING } from '@/lib/pricing'
import { Address } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET!
const JETTON_MASTER = process.env.PLANKTON_JETTON_ADDRESS!

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json()

    if (!paymentId) return NextResponse.json({ ok: false, error: 'Missing paymentId' })

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) return NextResponse.json({ ok: false, error: 'Payment not found' })
    if (payment.currency !== 'PLANKTON') return NextResponse.json({ ok: false, error: 'Wrong currency' })
    if (payment.status === 'PAID') return NextResponse.json({ ok: true, verified: true })

    const pricing = VPN_PRICING[payment.plan]
    const senderRaw = Address.parse(payment.wallet).toRawString()
    const paymentWalletRaw = Address.parse(PAYMENT_WALLET).toRawString()
    const jettonMasterRaw = Address.parse(JETTON_MASTER).toRawString()

    // Look at account events after this payment was created.
    // Small -60s tolerance covers clock/indexing differences but prevents
    // an older identical transfer from activating a fresh payment.
    const since = Math.floor(payment.createdAt.getTime() / 1000) - 60

    const eventsRes = await fetch(
      `https://tonapi.io/v2/accounts/${PAYMENT_WALLET}/events?limit=20&subject_only=true`,
      { headers: tonapiHeaders(), cache: 'no-store' }
    )

    if (!eventsRes.ok) {
      return NextResponse.json({ ok: true, verified: false, pending: true })
    }

    const eventsData = await eventsRes.json()
    const events: any[] = eventsData.events ?? []

    const match = events.find((evt) => {
      if ((evt.timestamp ?? 0) < since) return false
      return (evt.actions ?? []).some((action: any) => {
        if (action.type !== 'JettonTransfer') return false
        const jt = action.JettonTransfer
        try {
          const fromRaw = Address.parse(jt?.sender?.address ?? '').toRawString()
          const toRaw = Address.parse(jt?.recipient?.address ?? '').toRawString()
          const tokenRaw = Address.parse(jt?.jetton?.address ?? '').toRawString()
          return (
            fromRaw === senderRaw &&
            toRaw === paymentWalletRaw &&
            tokenRaw === jettonMasterRaw &&
            BigInt(jt?.amount ?? '0') >= BigInt(payment.amountToken || '0')
          )
        } catch {
          return false
        }
      })
    })

    if (!match) {
      return NextResponse.json({ ok: true, verified: false, pending: true })
    }

    if (!payment.amountToken || payment.amountToken === '0') {
      return NextResponse.json({ ok: false, error: 'Payment has no locked amount — recreate payment' })
    }

    const eventId: string = match.event_id
    if (!eventId) {
      return NextResponse.json({ ok: true, verified: false, pending: true })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + pricing.days)

    await prisma.$transaction(async (tx) => {
      // Setting txHash = eventId inside updateMany relies on the @unique constraint:
      // if another payment already claimed this event, the write will throw P2002
      // and roll back the transaction before subscription.create is reached.
      const updated = await tx.payment.updateMany({
        where: { id: payment.id, status: 'PENDING' },
        data: { status: 'PAID', paidAt: new Date(), txHash: eventId },
      })

      if (updated.count === 0) return

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

    return NextResponse.json({ ok: true, verified: true })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'Transaction already used for another payment' })
    }
    return NextResponse.json({ ok: false, error: e.message ?? 'Server error' })
  }
}
