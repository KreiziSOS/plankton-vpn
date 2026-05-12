import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VPN_PRICING, calculateNano } from '@/lib/pricing'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { wallet, plan, currency } = body

    if (!wallet || !plan || !currency) {
      return NextResponse.json({ ok: false, error: 'Missing wallet, plan or currency' })
    }

    const pricing = VPN_PRICING[plan as keyof typeof VPN_PRICING]
    if (!pricing) return NextResponse.json({ ok: false, error: 'Invalid plan' })

    if (currency !== 'TON' && currency !== 'PLANKTON') {
      return NextResponse.json({ ok: false, error: 'Invalid currency' })
    }

    await prisma.user.upsert({
      where:  { wallet },
      update: {},
      create: { wallet },
    })

    const amountUsd   = currency === 'TON' ? pricing.tonUsd : pricing.planktonUsd
    const amountToken = await calculateNano(plan as keyof typeof VPN_PRICING, currency)

    const payment = await prisma.payment.create({
      data: { wallet, plan, currency, amountUsd, amountToken, status: 'PENDING' },
    })

    return NextResponse.json({ ok: true, payment })
  } catch (e) {
    console.error('payment/create error:', e)
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
