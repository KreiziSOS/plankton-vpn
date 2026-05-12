import { NextResponse } from 'next/server'
import { VPN_PRICING } from '@/lib/pricing'
import { getRates } from '@/lib/rates'

export async function GET() {
  try {
    const { ton: tonRate, plankton: planktonRate, fetchedAt } = await getRates()

    const plans = Object.entries(VPN_PRICING).map(([planKey, pricing]) => {
      const tonNano      = String(Math.ceil((pricing.tonUsd      / tonRate)      * 1e9))
      const planktonNano = String(Math.ceil((pricing.planktonUsd / planktonRate) * 1e9))

      // tonDisplay: human TON amount with 2 decimals — e.g. "1.23"
      const tonDisplay = (Number(tonNano) / 1e9).toFixed(2)

      // planktonDisplay: human PLANKTON amount, comma-separated thousands — e.g. "29,084"
      const planktonDisplay = Math.ceil(Number(planktonNano) / 1e9).toLocaleString('en-US')

      return {
        plan: planKey,
        days: pricing.days,
        tonUsd: pricing.tonUsd,
        planktonUsd: pricing.planktonUsd,
        tonNano,
        planktonNano,
        tonDisplay,
        planktonDisplay,
      }
    })

    return NextResponse.json({
      plans,
      rates: {
        ton:       tonRate,
        plankton:  planktonRate,
        updatedAt: new Date(fetchedAt).toISOString(),
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message ?? 'Failed to fetch rates' },
      { status: 503 }
    )
  }
}
