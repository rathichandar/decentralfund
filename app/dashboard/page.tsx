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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-gray-200 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Connect Your Wallet</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Please connect your wallet to view your dashboard and manage your campaigns
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 inline-block">
            👆 Click "Connect Wallet" in the navigation bar above
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold mb-4">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-600">
          Manage your campaigns and contributions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="relative bg-white p-7 rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Campaigns Created</span>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{stats.totalCreated}</div>
            <div className="text-sm text-blue-600 font-semibold">
              {stats.activeCampaigns} active
            </div>
          </div>
        </div>

        <div className="relative bg-white p-7 rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Campaigns Backed</span>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">{stats.totalBacked}</div>
            <div className="text-sm text-green-600 font-semibold">Total contributions</div>
          </div>
        </div>

        <div className="relative bg-white p-7 rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Raised</span>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">
              {formatEther(stats.totalRaised).slice(0, 6)} ETH
            </div>
            <div className="text-sm text-purple-600 font-semibold">From your campaigns</div>
          </div>
        </div>

        <div className="relative bg-white p-7 rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Contributed</span>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-1">
              {formatEther(stats.totalContributed).slice(0, 6)} ETH
            </div>
            <div className="text-sm text-orange-600 font-semibold">To other campaigns</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 mb-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold mb-3">Start Your Campaign</h3>
            <p className="text-blue-100 text-lg">
              Launch a new crowdfunding campaign on the blockchain and reach thousands of backers
            </p>
          </div>
          <Link
            href="/create"
            className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-200 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('created')}
            className={`py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'created'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            My Campaigns ({stats.totalCreated})
          </button>
          <button
            onClick={() => setActiveTab('backed')}
            className={`py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'backed'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Backed Campaigns ({stats.totalBacked})
          </button>
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold text-gray-900">{campaign.title}</h3>
            {isActive ? (
              <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            ) : (
              <span className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <XCircle className="w-3.5 h-3.5" />
                Ended
              </span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-bold text-gray-900 text-base">
            {raisedEth.slice(0, 6)} ETH raised
          </span>
          <span className="text-gray-500 font-semibold">{progress.toFixed(0)}% of {goalEth.slice(0, 6)} ETH</span>
        </div>
        <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              progress >= 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t-2 border-gray-100 gap-4">
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold">{daysLeft} days left</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold">{campaign.contributorCount.toString()} backers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-pink-600" />
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-xs font-bold text-purple-700">{campaign.category}</span>
          </div>
        </div>

        <Link
          href={`/campaigns/${campaign.id}`}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          View Details
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <DashboardContent />
    </div>
  )
}