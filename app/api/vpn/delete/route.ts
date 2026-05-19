import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const wallet = body.wallet
    const deviceId = body.deviceId

    if (!wallet || !deviceId) {
      return NextResponse.json(
        { ok: false, error: 'Wallet and deviceId required' },
        { status: 400 }
      )
    }

    const device = await prisma.vpnDevice.findFirst({
      where: {
        id: deviceId,
        wallet,
      },
    })

    if (!device) {
      return NextResponse.json(
        { ok: false, error: 'Device not found' },
        { status: 404 }
      )
    }

    if (device.clientId) {
      const cookie = await loginWgEasy()

      const deleteRes = await fetch(
        `${WG_URL}/api/wireguard/client/${device.clientId}`,
        {
          method: 'DELETE',
          headers: {
            Cookie: cookie,
          },
        }
      )

      if (!deleteRes.ok) {
        const text = await deleteRes.text()

        return NextResponse.json(
          {
            ok: false,
            error: text || 'Failed to delete WG client',
          },
          { status: 500 }
        )
      }
    }

    await prisma.vpnDevice.delete({
      where: {
        id: device.id,
      },
    })

    return NextResponse.json({
      ok: true,
      deleted: true,
      deviceId: device.id,
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