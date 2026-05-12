import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCronRequest } from '@/lib/cron-auth'
import { VPN_PRICING } from '@/lib/pricing'
import { Address } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const CRON_SECRET = process.env.CRON_SECRET
const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET!

const MIN_AGE_MS    = 30_000          // 30s  — past the frontend polling window
const SETTLE_WINDOW = 24 * 3600_000   // 24h  — how far back we try to settle
const EXPIRE_AFTER  = 25 * 3600_000   // 25h  — 1h buffer: gives tonapi time to index
                                       //        before we permanently close the payment

export async function GET(req: Request) {
  if (!CRON_SECRET || !verifyCronRequest(req, CRON_SECRET)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = Date.now()

    // FIND first: attempt settlement for payments in the [MIN_AGE_MS, SETTLE_WINDOW] window.
    // EXPIRE after: only then permanently close payments older than EXPIRE_AFTER (25h).
    // The 1h gap between SETTLE_WINDOW and EXPIRE_AFTER is intentional — it lets a payment
    // that just crossed 24h remain PENDING long enough for one more cron run to catch it,
    // covering late tonapi indexing (typically seconds, at worst minutes).
    const pending = await prisma.payment.findMany({
      where: {
        currency: 'TON',
        status: 'PENDING',
        createdAt: {
          lt: new Date(now - MIN_AGE_MS),
          gt: new Date(now - SETTLE_WINDOW),
        },
      },
    })

    if (pending.length === 0) {
      // Nothing to settle — still run expiry so stale rows are cleaned up.
      const { count: expiredCount } = await prisma.payment.updateMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: new Date(now - EXPIRE_AFTER) },
        },
        data: { status: 'EXPIRED' },
      })
      return NextResponse.json({ ok: true, settled: 0, skipped: 0, expired: expiredCount })
    }

    // One tonapi call fetches the latest 100 incoming transactions for PAYMENT_WALLET.
    // In-memory matching means we pay for exactly 1 RPS unit regardless of how many
    // pending payments we have.
    const txRes = await fetch(
      `https://tonapi.io/v2/blockchain/accounts/${PAYMENT_WALLET}/transactions?limit=100`,
      { headers: tonapiHeaders(), cache: 'no-store' }
    )

    if (!txRes.ok) {
      return NextResponse.json({ ok: false, error: 'tonapi unavailable' }, { status: 502 })
    }

    const txData = await txRes.json()
    const transactions: any[] = txData.transactions ?? []

    const settled: string[] = []
    const skipped: string[] = []

    for (const payment of pending) {
      const pricing = VPN_PRICING[payment.plan]
      const senderRaw = Address.parse(payment.wallet).toRawString()
      const createdTs = payment.createdAt.getTime() / 1000

      const match = transactions.find((tx: any) => {
        try {
          const from = Address.parse(tx.in_msg?.source?.address ?? '').toRawString()
          const value = BigInt(tx.in_msg?.value ?? '0')
          const ts: number = tx.utime ?? 0
          return (
            from === senderRaw &&
            value >= BigInt(pricing.tonNano) &&
            ts >= createdTs - 60 &&   // tx can arrive up to 60s before we recorded the payment
            ts <= createdTs + 1800    // give 30min for confirmation
          )
        } catch {
          return false
        }
      })

      if (!match) continue

      const txHash: string = match.hash
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + pricing.days)

      try {
        await prisma.$transaction(async (tx) => {
          const updated = await tx.payment.updateMany({
            where: { id: payment.id, status: 'PENDING' },
            data: { status: 'PAID', paidAt: new Date(), txHash },
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

        settled.push(payment.id)
      } catch (e: any) {
        // P2002 = txHash already claimed by another payment — safe to skip
        if (e?.code !== 'P2002') throw e
        skipped.push(payment.id)
      }
    }

    const { count: expiredCount } = await prisma.payment.updateMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: new Date(now - EXPIRE_AFTER) },
      },
      data: { status: 'EXPIRED' },
    })

    return NextResponse.json({
      ok: true,
      checked: pending.length,
      settled: settled.length,
      skipped: skipped.length,
      expired: expiredCount,
      settledIds: settled,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Server error' }, { status: 500 })
  }
}
