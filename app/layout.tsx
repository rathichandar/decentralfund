import { Toaster } from 'react-hot-toast'

import './globals.css'
import { Web3Provider } from '@/providers/web3-provider'
import '@rainbow-me/rainbowkit/styles.css'

export const metadata = {
  title: 'DecentralFund - Web3 Crowdfunding Platform',
  description: 'Transparent, decentralized crowdfunding for everyone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
          <Toaster position="bottom-right" />
        </Web3Provider>
      </body>
    </html>
  )
}
