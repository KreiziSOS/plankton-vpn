import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCronRequest } from '@/lib/cron-auth'

const WG_URL = process.env.WG_EASY_URL
const WG_PASSWORD = process.env.WG_EASY_PASSWORD
const CRON_SECRET = process.env.CRON_SECRET
const APP_URL = process.env.APP_URL || 'http://localhost:3000'

// tonapi free key: 1 RPS; anonymous: 0.25 RPS.
// Add buffer (10%) so we never hit the hard limit.
const TONAPI_DELAY_MS = process.env.TONAPI_KEY ? 1100 : 4100

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function loginWgEasy() {
  const res = await fetch(`${WG_URL}/api/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: WG_PASSWORD,
    }),
  })

  const cookie = res.headers.get('set-cookie')

  if (!res.ok || !cookie) {
    throw new Error('WG auth failed')
  }

  return cookie
}

async function disableWgClient(clientId: string, cookie: string) {
  const res = await fetch(`${WG_URL}/api/wireguard/client/${clientId}/disable`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
    },
  })

  return res.ok
}

async function enableWgClient(clientId: string, cookie: string) {
  const res = await fetch(`${WG_URL}/api/wireguard/client/${clientId}/enable`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
    },
  })

  return res.ok
}

async function checkHolderAccess(wallet: string) {
  const res = await fetch(
    `${APP_URL}/api/check-plankton?wallet=${encodeURIComponent(wallet)}`,
    {
      cache: 'no-store',
    }
  )

  const data = await res.json()

  return {
    balance: Number(data.balance || 0),
    hasAccess: Boolean(data.hasAccess),
  }
}

export async function GET(req: Request) {
  try {
    if (!CRON_SECRET || !verifyCronRequest(req, CRON_SECRET)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        devices: true,
      },
    })

    const cookie = await loginWgEasy()

    const results = []

    for (let i = 0; i < users.length; i++) {
      if (i > 0) await sleep(TONAPI_DELAY_MS)

      const user = users[i]
      const holder = await checkHolderAccess(user.wallet)

      for (const device of user.devices) {
        if (!device.clientId) continue

        if (!holder.hasAccess && device.enabled) {
          const wgDisabled = await disableWgClient(device.clientId, cookie)

          await prisma.vpnDevice.update({
            where: {
              id: device.id,
            },
            data: {
              enabled: false,
            },
          })

          results.push({
            wallet: user.wallet,
            device: device.name,
            action: 'disabled',
            balance: holder.balance,
            wgDisabled,
          })
        }

        if (holder.hasAccess && !device.enabled) {
          const wgEnabled = await enableWgClient(device.clientId, cookie)

          await prisma.vpnDevice.update({
            where: {
              id: device.id,
            },
            data: {
              enabled: true,
            },
          })

          results.push({
            wallet: user.wallet,
            device: device.name,
            action: 'enabled',
            balance: holder.balance,
            wgEnabled,
          })
        }
      }
    }

    return NextResponse.json({
      ok: true,
      checkedUsers: users.length,
      changes: results.length,
      results,
    })
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message || 'Server error',
      },
      { status: 500 }
    )
  }
}