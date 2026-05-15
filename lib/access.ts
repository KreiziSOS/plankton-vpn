import { prisma } from '@/lib/prisma'
import { Address } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const JETTON   = process.env.PLANKTON_JETTON_ADDRESS!
const MIN      = Number(process.env.MIN_PLANKTON_AMOUNT || '1')
const DECIMALS = 9

// Throws on tonapi error — callers decide how to handle unavailability.
export async function getPlanktonBalance(wallet: string): Promise<number> {
  const res = await fetch(
    `https://tonapi.io/v2/accounts/${wallet}/jettons`,
    { headers: tonapiHeaders(), cache: 'no-store' }
  )

  if (!res.ok) throw new Error(`tonapi HTTP ${res.status}`)

  const data      = await res.json()
  const balances: any[] = data.balances ?? []
  const targetRaw = Address.parse(JETTON).toRawString()

  const item = balances.find((x) => {
    try { return Address.parse(x.jetton.address).toRawString() === targetRaw }
    catch { return false }
  })

  const rawBalance = item?.balance ? BigInt(item.balance) : 0n
  return Number(rawBalance) / Math.pow(10, DECIMALS)
}

// ── Types ──────────────────────────────────────────────────────────────────────

type PlanktonResult = { balance: number } | { error: string }

export type AccessResult = {
  hasAccess: boolean
  source: 'holder' | 'subscription' | 'both' | 'none'
  subscription?: { plan: string; expiresAt: Date }
  plankton: PlanktonResult
}

// ── checkUserAccess ────────────────────────────────────────────────────────────
//
// Runs both checks in parallel. Tonapi failures are caught and surfaced as
// plankton.error — access can still be granted via subscription in that case.
// Prisma failures propagate to the caller (don't swallow DB errors).
//
// opts.skipSubscriptionCheck: pass true when the caller already knows
// subscription status from a prior DB query (avoids redundant round-trip).
export async function checkUserAccess(
  wallet: string,
  opts: { skipSubscriptionCheck?: boolean } = {}
): Promise<AccessResult> {
  const subQuery = opts.skipSubscriptionCheck
    ? Promise.resolve(null)
    : prisma.subscription.findFirst({
        where:   { wallet, active: true, expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: 'desc' },
      })

  // Tonapi errors are caught here; prisma errors propagate from subQuery.
  const planktonQuery = getPlanktonBalance(wallet)
    .then((balance): PlanktonResult => ({ balance }))
    .catch((e): PlanktonResult => ({ error: e.message ?? 'tonapi unavailable' }))

  const [subscription, plankton] = await Promise.all([subQuery, planktonQuery])

  const holderAccess = 'balance' in plankton && plankton.balance >= MIN
  const subAccess    = !!subscription

  const source =
    holderAccess && subAccess ? 'both'         :
    holderAccess              ? 'holder'       :
    subAccess                 ? 'subscription' :
                                'none'

  return {
    hasAccess: holderAccess || subAccess,
    source,
    ...(subscription
      ? { subscription: { plan: subscription.plan, expiresAt: subscription.expiresAt } }
      : {}),
    plankton,
  }
}
