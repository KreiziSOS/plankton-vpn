import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json({ ok: false, error: 'Wallet required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { wallet } })
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    const [totalRefs, activePaidRefs, earnedAgg, withdrawnAgg] = await Promise.all([
      prisma.user.count({ where: { referrerId: user.id } }),
      prisma.user.count({
        where: { referrerId: user.id, payments: { some: { status: 'PAID' } } },
      }),
      prisma.referralEarning.aggregate({
        where: { userId: user.id, status: 'available' },
        _sum: { amountTon: true },
      }),
      prisma.referralEarning.aggregate({
        where: { userId: user.id, status: 'withdrawn' },
        _sum: { amountTon: true },
      }),
    ])

    return NextResponse.json({
      ok: true,
      totalRefs,
      activePaidRefs,
      earnedTon: Number(earnedAgg._sum.amountTon ?? 0),
      withdrawnTon: Number(withdrawnAgg._sum.amountTon ?? 0),
      bonusYearAvailable: activePaidRefs >= 5 && !user.bonusYearGranted,
      bonusYearGranted: user.bonusYearGranted,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Server error' }, { status: 500 })
  }
}
