import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet required' }, { status: 400 })
  }

  const config = `[Interface]
PrivateKey = DEMO_PRIVATE_KEY
Address = 10.8.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = DEMO_SERVER_PUBLIC_KEY
Endpoint = vpn.plankton.ceo:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25

# Wallet: ${wallet}
# Plankton VPN demo config
`

  return new Response(config, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="plankton-vpn.conf"',
    },
  })
}