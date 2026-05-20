import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { wallet, refCode } = await req.json()

    if (!wallet) {
      return NextResponse.json({ ok: false, error: 'Wallet required' }, { status: 400 })
    }

    if (!refCode || typeof refCode !== 'string') {
      return NextResponse.json({ ok: false, error: 'refCode required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { wallet } })

    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    if (user.referrerId) {
      return NextResponse.json({ ok: false, error: 'Already referred' }, { status: 409 })
    }

    const referrer = await prisma.user.findUnique({ where: { refCode } })

    if (!referrer) {
      return NextResponse.json({ ok: false, error: 'Invalid referral code' }, { status: 404 })
    }

    if (referrer.id === user.id) {
      return NextResponse.json({ ok: false, error: 'Cannot refer yourself' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { referrerId: referrer.id, referredAt: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Server error' }, { status: 500 })
  }
}
