import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BOT_URL =
  (process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/PlanktonVPNBot').replace(/\/$/, '')

function generateRefCode() {
  return randomBytes(6).toString('base64url')
}

async function assignRefCode(wallet: string) {
  for (let i = 0; i < 5; i++) {
    const refCode = generateRefCode()

    try {
      return await prisma.user.upsert({
        where: { wallet },
        update: { refCode },
        create: { wallet, refCode },
      })
    } catch (e: any) {
      if (e?.code !== 'P2002') throw e
    }
  }

  throw new Error('Could not generate referral code')
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: 'Wallet required' },
        { status: 400 },
      )
    }

    const existing = await prisma.user.findUnique({ where: { wallet } })
    const user = existing?.refCode ? existing : await assignRefCode(wallet)
    const refCode = user.refCode!

    return NextResponse.json({
      ok: true,
      refCode,
      referralLink: `${BOT_URL}?startapp=${encodeURIComponent(`ref_${refCode}`)}`,
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || 'Server error' },
      { status: 500 },
    )
  }
}
