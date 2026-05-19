'use client'

import './globals.css'
import Script from 'next/script'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const TONCONNECT_MANIFEST_URL =
  process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ||
  'https://vpn.tokencycle.space/tonconnect-manifest.json'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" />

        <TonConnectUIProvider
          manifestUrl={TONCONNECT_MANIFEST_URL}
          actionsConfiguration={{
            twaReturnUrl: 'https://t.me/PlanktonVPNBot'
          }}
        >
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  )
}
