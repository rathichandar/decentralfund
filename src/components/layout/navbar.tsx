'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/ui/wallet-connect'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DecentralFund
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/campaigns" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Explore
            </Link>
            <Link 
              href="/create" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Campaign
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  )
}
