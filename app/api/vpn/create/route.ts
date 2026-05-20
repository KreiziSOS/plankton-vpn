import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkUserAccess } from '@/lib/access'
import { getActiveSubscriptionDeviceLimit } from '@/lib/vpn/deviceLimits'
import { generateOpenVpnConfig } from '@/lib/vpn/generateOpenVpnConfig'

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
    throw new Error('WG login failed')
  }

  return cookie
}

async function getClients(cookie: string) {
  const res = await fetch(`${WG_URL}/api/wireguard/client`, {
    headers: {
      Cookie: cookie,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to load WG clients')
  }

  return res.json()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const wallet = body.wallet
    const protocol =
      body.protocol === 'amnezia'
        ? 'amnezia'
        : body.protocol === 'openvpn'
          ? 'openvpn'
          : 'wireguard'

    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: 'Wallet required' },
        { status: 400 },
      )
    }

    const access = await checkUserAccess(wallet)

    if (!access.hasAccess) {
      return NextResponse.json(
        { ok: false, error: 'No access' },
        { status: 403 },
      )
    }

    const name =
      protocol === 'amnezia'
        ? `plankton-amnezia-${wallet.slice(2, 10)}`
        : protocol === 'openvpn'
          ? `plankton-openvpn-${wallet.slice(2, 10)}`
          : `plankton-${wallet.slice(2, 10)}`

    await prisma.user.upsert({
      where: {
        wallet,
      },
      update: {},
      create: {
        wallet,
      },
    })

    const existingDevice = await prisma.vpnDevice.findUnique({
      where: {
        wallet_name: {
          wallet,
          name,
        },
      },
    })

    if (existingDevice) {
      return NextResponse.json({
        ok: true,
        existed: true,
        device: existingDevice,
      })
    }

    const subscriptionDeviceLimit = await getActiveSubscriptionDeviceLimit(wallet)

    if (!subscriptionDeviceLimit) {
      const existingProtocolDevice = await prisma.vpnDevice.findFirst({
        where: {
          wallet,
          protocol,
        },
      })

      if (existingProtocolDevice) {
        return NextResponse.json({
          ok: true,
          existed: true,
          device: existingProtocolDevice,
        })
      }

      const protocolDevices = await prisma.vpnDevice.count({
        where: {
          wallet,
          protocol,
        },
      })

      if (protocolDevices >= 1) {
        const protocolLabel =
          protocol === 'amnezia'
            ? 'Amnezia'
            : protocol === 'openvpn'
              ? 'OpenVPN'
              : 'WireGuard'

        return NextResponse.json(
          {
            ok: false,
            error: `Holder access allows 1 ${protocolLabel} device.`,
            limit: 1,
            used: protocolDevices,
          },
          { status: 403 },
        )
      }
    }

    const currentDevices = await prisma.vpnDevice.count({
      where: {
        wallet,
      },
    })

    if (subscriptionDeviceLimit && currentDevices >= subscriptionDeviceLimit) {
      return NextResponse.json(
        {
          ok: false,
          error: `Device limit reached. Your current limit is ${subscriptionDeviceLimit}.`,
          limit: subscriptionDeviceLimit,
          used: currentDevices,
        },
        { status: 403 },
      )
    }

    if (protocol === 'openvpn') {
      const configText = generateOpenVpnConfig(name)
      const savedDevice = await prisma.vpnDevice.create({
        data: {
          wallet,
          name,
          protocol,
          clientId: name,
          address: process.env.OPENVPN_HOST || 'vpn.plankton.ceo',
          configText,
          enabled: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      return NextResponse.json({
        ok: true,
        existed: false,
        device: savedDevice,
      })
    }

    const cookie = await loginWgEasy()

    const clients = await getClients(cookie)

    const existingClient = clients.find((c: any) => c.name === name)

    if (existingClient) {
      const savedDevice = await prisma.vpnDevice.create({
        data: {
          wallet,
          name,
          protocol,
          clientId: existingClient.id,
          address: existingClient.address,
          enabled: existingClient.enabled ?? true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      return NextResponse.json({
        ok: true,
        existed: true,
        device: savedDevice,
      })
    }

    const createRes = await fetch(`${WG_URL}/api/wireguard/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({
        name,
      }),
    })

    if (!createRes.ok) {
      const text = await createRes.text()

      return NextResponse.json(
        {
          ok: false,
          error: text,
        },
        { status: 500 },
      )
    }

    const updatedClients = await getClients(cookie)

    const newClient = updatedClients.find((c: any) => c.name === name)

    if (!newClient) {
      throw new Error('WG client created but not found')
    }

    const savedDevice = await prisma.vpnDevice.create({
      data: {
        wallet,
        name,
        protocol,
        clientId: newClient.id,
        address: newClient.address,
        enabled: newClient.enabled ?? true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      ok: true,
      existed: false,
      device: savedDevice,
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
