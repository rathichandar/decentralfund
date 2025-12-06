'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from '@/components/ui/wallet-connect'
import { Rocket, Sparkles } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">
                DecentralFund
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link 
              href="/campaigns" 
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/campaigns')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              Explore
              {isActive('/campaigns') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/create" 
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${
                isActive('/create')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Create
              {isActive('/create') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>
            <Link 
              href="/dashboard" 
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
              {isActive('/dashboard') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              )}
            </Link>
            <div className="ml-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
