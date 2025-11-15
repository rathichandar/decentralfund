'use client'

import { useReadContract } from 'wagmi'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI } from '@/contracts'
import { Navbar } from '@/components/layout/navbar'

export default function TestContract() {
  const { data, isError, isLoading } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS,
    abi: CROWDFUNDING_FACTORY_ABI,
    functionName: 'getTotalCampaigns',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Contract Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Factory Contract</h2>
          <p className="text-sm text-gray-600 mb-2">Address: {CROWDFUNDING_FACTORY_ADDRESS}</p>
          
          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-600">❌ Error connecting to contract</p>}
          {data !== undefined && (
            <div className="text-green-600">
              ✅ Connected! Total Campaigns: {data.toString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}