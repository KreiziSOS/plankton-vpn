import { NextResponse } from 'next/server'
import { Address } from '@ton/core'
import { tonapiHeaders } from '@/lib/tonapi'

const JETTON_MASTER = process.env.PLANKTON_JETTON_ADDRESS!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ ok: false, error: 'Missing wallet' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://tonapi.io/v2/accounts/${encodeURIComponent(wallet)}/jettons/${encodeURIComponent(JETTON_MASTER)}`,
      { headers: tonapiHeaders(), cache: 'no-store' }
    )

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'tonapi error' }, { status: 502 })
    }

    const data = await res.json()
    const jettonWallet = data.wallet_address?.address

    if (!jettonWallet) {
      return NextResponse.json({ ok: false, error: 'Jetton wallet not found' }, { status: 404 })
    }

    // Return in user-friendly form so the client can pass it to sendTransaction
    const friendlyAddress = Address.parse(jettonWallet).toString()

    return NextResponse.json({ ok: true, jettonWallet: friendlyAddress })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Server error' }, { status: 500 })
  }
}
