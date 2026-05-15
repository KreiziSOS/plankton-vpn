import { NextResponse } from 'next/server'
import { getPlanktonBalance } from '@/lib/access'

const MIN = Number(process.env.MIN_PLANKTON_AMOUNT || '1')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json(
      { ok: false, error: 'Wallet is required' },
      { status: 400, headers: corsHeaders }
    )
  }

  try {
    const balance   = await getPlanktonBalance(wallet)
    const hasAccess = balance >= MIN

    return NextResponse.json(
      { ok: true, wallet, balance, hasAccess, minRequired: MIN },
      { headers: corsHeaders }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
