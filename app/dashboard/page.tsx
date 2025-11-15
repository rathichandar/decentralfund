'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Navbar } from '@/components/layout/navbar'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI } from '@/contracts'
import { formatEther } from 'viem'
import { 
  Loader2, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'

interface Campaign {
  id: string
  title: string
  description: string
  goal: bigint
  amountRaised: bigint
  deadline: number
  creator: string
  category: string
  isActive: boolean
  contributorCount: bigint
}

interface Contribution {
  campaignId: string
  campaignTitle: string
  amount: bigint
  timestamp: number
}

function DashboardContent() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'created' | 'backed'>('created')
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([])
  const [backedCampaigns, setBackedCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get total campaigns
  const { data: totalCampaigns } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS,
    abi: CROWDFUNDING_FACTORY_ABI,
    functionName: 'getTotalCampaigns',
  })

  // Fetch user's campaigns
  useEffect(() => {
    async function fetchUserCampaigns() {
      if (!address || !totalCampaigns) return

      setIsLoading(true)
      try {
        const total = Number(totalCampaigns)
        const created: Campaign[] = []
        const backed: Campaign[] = []

        // In a real implementation, you would:
        // 1. Fetch all campaigns and filter by creator === address
        // 2. Fetch user's contributions from contract events
        // 3. Match contributions to campaigns

        // For now, create mock data for demonstration
        // You'll replace this with actual contract calls

        // Mock created campaigns
        if (total > 0) {
          for (let i = 0; i < Math.min(total, 3); i++) {
            created.push({
              id: i.toString(),
              title: `My Campaign ${i + 1}`,
              description: 'Campaign description',
              goal: BigInt(5000000000000000000), // 5 ETH
              amountRaised: BigInt(Math.floor(Math.random() * 3000000000000000000)), // Random amount
              deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
              creator: address,
              category: 'Technology',
              isActive: true,
              contributorCount: BigInt(Math.floor(Math.random() * 20)),
            })
          }
        }

        setCreatedCampaigns(created)
        setBackedCampaigns(backed)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCampaigns()
  }, [address, totalCampaigns])

  // Calculate statistics
  const stats = {
    totalCreated: createdCampaigns.length,
    totalBacked: backedCampaigns.length,
    totalRaised: createdCampaigns.reduce((acc, c) => acc + c.amountRaised, BigInt(0)),
    totalContributed: backedCampaigns.reduce((acc, c) => acc + c.amountRaised, BigInt(0)),
    activeCampaigns: createdCampaigns.filter(c => c.isActive).length,
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">
          Manage your campaigns and contributions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Campaigns Created</span>
            <Plus className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalCreated}</div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.activeCampaigns} active
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Campaigns Backed</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalBacked}</div>
          <div className="text-sm text-gray-500 mt-1">Total contributions</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Raised</span>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatEther(stats.totalRaised).slice(0, 6)} ETH
          </div>
          <div className="text-sm text-gray-500 mt-1">From your campaigns</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Contributed</span>
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatEther(stats.totalContributed).slice(0, 6)} ETH
          </div>
          <div className="text-sm text-gray-500 mt-1">To other campaigns</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Start Your Campaign</h3>
            <p className="text-blue-100">
              Launch a new crowdfunding campaign on the blockchain
            </p>
          </div>
          <Link
            href="/create"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('created')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'created'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Campaigns ({stats.totalCreated})
            </button>
            <button
              onClick={() => setActiveTab('backed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'backed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Backed Campaigns ({stats.totalBacked})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading your campaigns...</span>
        </div>
      ) : activeTab === 'created' ? (
        <div>
          {createdCampaigns.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first campaign and start raising funds!
              </p>
              <Link
                href="/create"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {createdCampaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} isCreator={true} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {backedCampaigns.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No contributions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Browse campaigns and support projects you believe in!
              </p>
              <Link
                href="/campaigns"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Campaigns
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {backedCampaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} isCreator={false} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CampaignRow({ campaign, isCreator }: { campaign: Campaign; isCreator: boolean }) {
  const progress = Number((campaign.amountRaised * 100n) / campaign.goal)
  const daysLeft = Math.max(
    0,
    Math.floor((campaign.deadline - Date.now() / 1000) / 86400)
  )
  const isActive = campaign.isActive && daysLeft > 0
  const goalEth = formatEther(campaign.goal)
  const raisedEth = formatEther(campaign.amountRaised)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
            {isActive ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Ended
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{campaign.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-900">
            {raisedEth.slice(0, 6)} ETH raised
          </span>
          <span className="text-gray-500">{progress.toFixed(0)}% of {goalEth.slice(0, 6)} ETH</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{campaign.contributorCount.toString()} backers</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{campaign.category}</span>
          </div>
        </div>

        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
        >
          View Details
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardContent />
    </div>
  )
}