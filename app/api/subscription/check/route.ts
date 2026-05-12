import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ ok: false })
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      wallet,
      active: true,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      expiresAt: 'desc',
    },
  })

  return NextResponse.json({
    ok: true,
    active: !!subscription,
    subscription,
  })
}