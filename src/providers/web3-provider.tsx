'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'

// Configure for Sepolia testnet
const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'DecentralFund',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [
    sepolia,  // Primary testnet
    mainnet,  // For future production
  ],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || 
      'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    ),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000, // 30 seconds
    },
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}