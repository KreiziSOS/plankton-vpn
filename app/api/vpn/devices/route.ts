import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: 'Wallet required' },
        { status: 400 }
      )
    }

    const devices = await prisma.vpnDevice.findMany({
      where: {
        wallet,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      ok: true,
      devices,
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