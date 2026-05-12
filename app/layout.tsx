'use client'

import './globals.css'
import Script from 'next/script'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

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
          manifestUrl="https://plankton-vpn-mvp.vercel.app/tonconnect-manifest.json"
          actionsConfiguration={{
            twaReturnUrl: 'https://t.me/GreenfiedStorageProviders_bot'
          }}
        >
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  )
}