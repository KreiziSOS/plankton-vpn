import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkUserAccess } from '@/lib/access'
import { generateAmneziaConfig } from '@/lib/vpn/generateAmneziaConfig'
import { enhanceWireGuardConfig } from '@/lib/vpn/enhanceWireGuardConfig'

const WG_URL = process.env.WG_EASY_URL
const WG_PASSWORD = process.env.WG_EASY_PASSWORD

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')
    const requestedProtocol = searchParams.get('protocol')
    const protocolFilter =
      requestedProtocol === 'amnezia' || requestedProtocol === 'wireguard'
        ? requestedProtocol
        : undefined

    if (!name) {
      return NextResponse.json(
        { ok: false, error: 'Name required' },
        { status: 400 },
      )
    }

    const device = await prisma.vpnDevice.findFirst({
      where: {
        name,
        ...(protocolFilter ? { protocol: protocolFilter } : {}),
      },
    })

    if (!device) {
      return NextResponse.json(
        { ok: false, error: 'Device not found' },
        { status: 404 },
      )
    }

    if (device.expiresAt && new Date(device.expiresAt) < new Date()) {
      return NextResponse.json(
        { ok: false, error: 'VPN subscription expired' },
        { status: 403 },
      )
    }

    if (!device.enabled) {
      return NextResponse.json(
        { ok: false, error: 'VPN device disabled' },
        { status: 403 },
      )
    }

    const access = await checkUserAccess(device.wallet)

    if (!access.hasAccess) {
      return NextResponse.json(
        {
          ok: false,
          error: 'No active subscription or insufficient PLANKTON balance',
        },
        { status: 403 },
      )
    }

    if (!device.clientId) {
      return NextResponse.json(
        { ok: false, error: 'VPN clientId missing' },
        { status: 500 },
      )
    }

    const cookie = await loginWgEasy()

    const configRes = await fetch(
      `${WG_URL}/api/wireguard/client/${device.clientId}/configuration`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    )

    if (!configRes.ok) {
      const text = await configRes.text()

      return NextResponse.json(
        { ok: false, error: text },
        { status: 500 },
      )
    }

    const rawConfig = await configRes.text()
    const stableConfig = enhanceWireGuardConfig(rawConfig)

    const protocol = device.protocol === 'amnezia' ? 'amnezia' : 'wireguard'

    // const finalConfig =
    //   protocol === 'amnezia'
    //     ? generateAmneziaConfig(stableConfig)
    //     : stableConfig
    const finalConfig = stableConfig

    const filename =
      protocol === 'amnezia'
        ? `${device.name}.awg`
        : `${device.name}.conf`

    return new Response(finalConfig, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message || 'Server error',
      },
      { status: 500 },
    )
  }
}
