import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCronRequest } from '@/lib/cron-auth'
import { checkUserAccess } from '@/lib/access'

const WG_URL      = process.env.WG_EASY_URL
const WG_PASSWORD = process.env.WG_EASY_PASSWORD
const CRON_SECRET = process.env.CRON_SECRET

// tonapi free key: 1 RPS; anonymous: 0.25 RPS. Add 10% buffer.
const TONAPI_DELAY_MS = process.env.TONAPI_KEY ? 1100 : 4100

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function loginWgEasy() {
  const res = await fetch(`${WG_URL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: WG_PASSWORD }),
  })

  const cookie = res.headers.get('set-cookie')
  if (!res.ok || !cookie) throw new Error('WG auth failed')
  return cookie
}

async function disableWgClient(clientId: string, cookie: string) {
  const res = await fetch(`${WG_URL}/api/wireguard/client/${clientId}/disable`, {
    method: 'POST',
    headers: { Cookie: cookie },
  })
  return res.ok
}

async function enableWgClient(clientId: string, cookie: string) {
  const res = await fetch(`${WG_URL}/api/wireguard/client/${clientId}/enable`, {
    method: 'POST',
    headers: { Cookie: cookie },
  })
  return res.ok
}

export async function GET(req: Request) {
  try {
    if (!CRON_SECRET || !verifyCronRequest(req, CRON_SECRET)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Only load users who have at least one device; include their active subscriptions.
    const users = await prisma.user.findMany({
      where: { devices: { some: {} } },
      include: {
        devices: true,
        subscriptions: {
          where: { active: true, expiresAt: { gt: new Date() } },
        },
      },
    })

    const cookie = await loginWgEasy()

    const results: object[] = []
    let skippedCount   = 0
    let tonapiCallCount = 0

    for (const user of users) {
      const { wallet } = user
      const hasActiveSub = user.subscriptions.length > 0
      const allEnabled   = user.devices.every(d => d.enabled)

      // ── Branch 1: active subscription, all devices already on ──────────────
      // Nothing to do — no tonapi call, no delay.
      if (hasActiveSub && allEnabled) {
        skippedCount++
        continue
      }

      // ── Branch 2: active subscription, some devices are off ────────────────
      // Access is guaranteed by subscription — skip tonapi, re-enable directly.
      if (hasActiveSub) {
        for (const device of user.devices) {
          if (!device.clientId || device.enabled) continue

          const wgEnabled = await enableWgClient(device.clientId, cookie)

          await prisma.vpnDevice.update({
            where: { id: device.id },
            data:  { enabled: true },
          })

          results.push({
            wallet,
            device:    device.name,
            action:    'enabled',
            reason:    'subscription',
            wgEnabled,
          })
        }
        continue  // no tonapi call, no delay
      }

      // ── Branch 3: no active subscription — check PLANKTON balance ──────────
      if (tonapiCallCount > 0) await sleep(TONAPI_DELAY_MS)
      tonapiCallCount++

      // skipSubscriptionCheck: we already confirmed !hasActiveSub above.
      const access = await checkUserAccess(wallet, { skipSubscriptionCheck: true })

      // Tonapi outage: don't disable devices — we can't confirm lack of access.
      if ('error' in access.plankton) {
        console.warn(`[expire-vpn] tonapi unavailable for ${wallet}, skipping: ${access.plankton.error}`)
        skippedCount++
        continue
      }

      const hasAccess = access.hasAccess
      const reason    = access.source  // 'holder' | 'none'
      const balance   = (access.plankton as { balance: number }).balance

      for (const device of user.devices) {
        if (!device.clientId) continue

        if (!hasAccess && device.enabled) {
          const wgDisabled = await disableWgClient(device.clientId, cookie)

          await prisma.vpnDevice.update({
            where: { id: device.id },
            data:  { enabled: false },
          })

          results.push({
            wallet,
            device:  device.name,
            action:  'disabled',
            reason,
            balance,
            wgDisabled,
          })
        }

        if (hasAccess && !device.enabled) {
          const wgEnabled = await enableWgClient(device.clientId, cookie)

          await prisma.vpnDevice.update({
            where: { id: device.id },
            data:  { enabled: true },
          })

          results.push({
            wallet,
            device:  device.name,
            action:  'enabled',
            reason,
            balance,
            wgEnabled,
          })
        }
      }
    }

    return NextResponse.json({
      ok:           true,
      checkedUsers: users.length,
      skipped:      skippedCount,
      tonapiCalls:  tonapiCallCount,
      changes:      results.length,
      results,
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || 'Server error' },
      { status: 500 }
    )
  }
}
