import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: 'Missing paymentId' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { subscription: true },
    })

    if (!payment) {
      return NextResponse.json({ ok: false, error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status === 'PENDING' && payment.expiresAt && payment.expiresAt < new Date()) {
      const expired = await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'EXPIRED' },
        include: { subscription: true },
      })

      return NextResponse.json({
        ok: true,
        payment: expired,
        subscription: expired.subscription,
      })
    }

    return NextResponse.json({
      ok: true,
      payment,
      subscription: payment.subscription,
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message ?? 'Server error' },
      { status: 500 }
    )
  }
}

