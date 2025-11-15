'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { Navbar } from '@/components/layout/navbar'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI } from '@/contracts'
import { Loader2 } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  goal: bigint
  amountRaised: bigint
  deadline: number
  creator: string
  contractAddress: string
  category: string
  imageUrl?: string
  isActive: boolean
  contributorCount: bigint
}

function CampaignsContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Get total number of campaigns
  const { data: totalCampaigns, isError: totalError, isLoading: isLoadingTotal } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS,
    abi: CROWDFUNDING_FACTORY_ABI,
    functionName: 'getTotalCampaigns',
  })

  // Fetch all campaigns
  useEffect(() => {
    async function fetchCampaigns() {
      if (totalCampaigns === undefined) return

      setIsLoading(true)
      const total = Number(totalCampaigns)
      const campaignsData: Campaign[] = []

      try {
        // For now, create placeholder campaigns
        // You'll need to add logic to fetch actual campaign details from your contract
        for (let i = 0; i < total; i++) {
          const campaign: Campaign = {
            id: i.toString(),
            title: `Campaign ${i + 1}`,
            description: 'Campaign description will be loaded from the blockchain...',
            goal: BigInt(1000000000000000000), // 1 ETH in wei
            amountRaised: BigInt(0),
            deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
            creator: '0x0000000000000000000000000000000000000000',
            contractAddress: '0x0000000000000000000000000000000000000000',
            category: 'Technology',
            imageUrl: '',
            isActive: true,
            contributorCount: BigInt(0),
          }
          campaignsData.push(campaign)
        }

        setCampaigns(campaignsData)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [totalCampaigns])

  const categories = ['all', 'Technology', 'Art', 'Education', 'Health', 'Environment', 'Other']

  const filteredCampaigns =
    selectedCategory === 'all'
      ? campaigns
      : campaigns.filter((c) => c.category === selectedCategory)

  if (totalError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-red-600 text-lg mb-4">
            ❌ Error connecting to smart contract
          </p>
          <p className="text-gray-600">
            Please check your network connection and make sure you're on Sepolia testnet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Explore Campaigns
        </h1>
        <p className="text-xl text-gray-600">
          Discover and support innovative projects on the blockchain
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {isLoadingTotal ? '...' : totalCampaigns?.toString() || '0'}
          </div>
          <div className="text-gray-600">Total Campaigns</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {campaigns.filter((c) => c.isActive).length}
          </div>
          <div className="text-gray-600">Active Campaigns</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {campaigns.reduce((acc, c) => acc + Number(c.contributorCount), 0)}
          </div>
          <div className="text-gray-600">Total Backers</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading || isLoadingTotal ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading campaigns...</span>
        </div>
      ) : filteredCampaigns.length === 0 && totalCampaigns === BigInt(0) ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to create a campaign on DecentralFund!
          </p>
          <a
            href="/create"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Campaign
          </a>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No campaigns in this category
          </h3>
          <p className="text-gray-600 mb-6">
            Try selecting a different category or view all campaigns
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View All Campaigns
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CampaignsContent />
    </div>
  )
}