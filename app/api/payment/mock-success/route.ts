import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VPN_PRICING } from '@/lib/pricing'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const paymentId = body.paymentId

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    })

    if (!payment) {
      return NextResponse.json({ ok: false })
    }

    const pricing = VPN_PRICING[payment.plan]

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + pricing.days)

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    })

    await prisma.subscription.create({
      data: {
        wallet: payment.wallet,
        plan: payment.plan,
        currency: payment.currency,
        paymentId: payment.id,
        expiresAt,
      },
    })

    return NextResponse.json({
      ok: true,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}