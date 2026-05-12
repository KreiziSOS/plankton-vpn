import { NextResponse } from 'next/server'
import { Address } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const JETTON = process.env.PLANKTON_JETTON_ADDRESS!
const MIN = Number(process.env.MIN_PLANKTON_AMOUNT || '1')
const DECIMALS = 9

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function normalizeAddress(address: string) {
  return Address.parse(address).toRawString()
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
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
    const targetJetton = normalizeAddress(JETTON)

    const res = await fetch(
      `https://tonapi.io/v2/accounts/${wallet}/jettons`,
      {
        headers: tonapiHeaders(),
        cache: 'no-store',
      }
    )

    const data = await res.json()
    const balances = data.balances || []

    const item = balances.find((x: any) => {
      try {
        return normalizeAddress(x.jetton.address) === targetJetton
      } catch {
        return false
      }
    })

    const rawBalance = item?.balance ? BigInt(item.balance) : 0n
    const balance = Number(rawBalance) / Math.pow(10, DECIMALS)
    const hasAccess = balance >= MIN

    return NextResponse.json(
      {
        ok: true,
        wallet,
        balance,
        hasAccess,
        minRequired: MIN,
        found: Boolean(item),
      },
      { headers: corsHeaders }
    )
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message || 'Server error',
      },
      { status: 500, headers: corsHeaders }
    )
  }
}