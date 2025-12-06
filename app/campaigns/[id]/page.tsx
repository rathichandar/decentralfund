'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Navbar } from '@/components/layout/navbar'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI, CAMPAIGN_ABI } from '@/contracts'
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Wallet,
  Share2,
  Heart,
  CheckCircle2,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react'

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

function CampaignDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const campaignId = params?.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch campaign details from contract
  const { data: campaignData, isError, isLoading: isFetchingCampaign, refetch } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS,
    abi: CROWDFUNDING_FACTORY_ABI,
    functionName: 'getCampaignDetails',
    args: [BigInt(campaignId)],
  })

  // Contribute to campaign
  const { writeContract, data: hash, isPending: isContributing } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Parse campaign data
  useEffect(() => {
    if (campaignData) {
      const [
        campaignAddress,
        creator,
        title,
        description,
        goal,
        amountRaised,
        deadline,
        category,
        imageUrl,
        isActive,
        contributorCount,
      ] = campaignData as any

      setCampaign({
        id: campaignId,
        contractAddress: campaignAddress,
        creator,
        title,
        description,
        goal,
        amountRaised,
        deadline: Number(deadline),
        category,
        imageUrl,
        isActive,
        contributorCount,
      })
      setIsLoading(false)
    }
  }, [campaignData, campaignId])

  // Handle contribution success
  useEffect(() => {
    if (isConfirmed) {
      setShowSuccess(true)
      setContributionAmount('')
      refetch()
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }
  }, [isConfirmed, refetch])

  const handleContribute = async () => {
    if (!contributionAmount || !campaign || !isConnected) return

    try {
      writeContract({
        address: campaign.contractAddress as `0x${string}`,
        abi: CAMPAIGN_ABI,
        functionName: 'contribute',
        value: parseEther(contributionAmount),
      })
    } catch (error) {
      console.error('Error contributing:', error)
    }
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">
            Campaign not found or error loading campaign
          </p>
          <button
            onClick={() => router.push('/campaigns')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Campaigns
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || isFetchingCampaign || !campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading campaign details...</span>
        </div>
      </div>
    )
  }

  const progress = Number((campaign.amountRaised * 100n) / campaign.goal)
  const goalEth = formatEther(campaign.goal)
  const raisedEth = formatEther(campaign.amountRaised)
  const daysLeft = Math.max(0, Math.floor((campaign.deadline - Date.now() / 1000) / 86400))
  const deadlineDate = new Date(campaign.deadline * 1000).toLocaleDateString()
  const isExpired = campaign.deadline < Date.now() / 1000
  const isCreator = address?.toLowerCase() === campaign.creator.toLowerCase()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-bold">Contribution Successful!</p>
            <p className="text-sm">Thank you for supporting this campaign</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.push('/campaigns')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Campaigns
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Image */}
          <div className="relative h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl overflow-hidden shadow-lg">
            {campaign.imageUrl ? (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
                <Target className="w-32 h-32 text-white/50" />
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg ${
                isExpired 
                  ? 'bg-red-500/90 text-white' 
                  : campaign.isActive 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-gray-500/90 text-white'
              }`}>
                {isExpired ? 'Ended' : campaign.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-purple-600 shadow-lg">
                {campaign.category}
              </span>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {campaign.title}
            </h1>

            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Created by</p>
                <p className="text-gray-900 font-mono text-sm">
                  {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                </p>
              </div>
              {isCreator && (
                <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  You're the creator
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this campaign</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{goalEth.slice(0, 6)}</p>
              <p className="text-sm text-gray-500 font-medium">Goal (ETH)</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{raisedEth.slice(0, 6)}</p>
              <p className="text-sm text-gray-500 font-medium">Raised (ETH)</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{campaign.contributorCount.toString()}</p>
              <p className="text-sm text-gray-500 font-medium">Backers</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
              <p className="text-sm text-gray-500 font-medium">Days Left</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-3xl font-black text-gray-900">
                  {raisedEth.slice(0, 8)} ETH
                </span>
                <span className="text-lg font-bold text-gray-500">
                  {progress.toFixed(0)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner mb-3">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <p className="text-gray-600 text-sm font-medium">
                Goal: {goalEth.slice(0, 8)} ETH
              </p>
            </div>

            {/* Campaign Info */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-bold">{deadlineDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Wallet className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Contract Address</p>
                  <p className="font-mono text-xs">
                    {campaign.contractAddress.slice(0, 10)}...{campaign.contractAddress.slice(-8)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contribution Form */}
            {!isExpired && campaign.isActive && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Contribution Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  disabled={isContributing || isConfirming || !isConnected}
                />
              </div>
            )}

            {/* Action Buttons */}
            {!isConnected ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm font-medium text-center">
                  Please connect your wallet to contribute
                </p>
              </div>
            ) : isExpired ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium text-center">
                  This campaign has ended
                </p>
              </div>
            ) : !campaign.isActive ? (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 text-sm font-medium text-center">
                  This campaign is not active
                </p>
              </div>
            ) : (
              <button
                onClick={handleContribute}
                disabled={!contributionAmount || isContributing || isConfirming || parseFloat(contributionAmount) <= 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isContributing || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isContributing ? 'Confirming...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Back this Campaign
                  </>
                )}
              </button>
            )}

            {/* Share Button */}
            <button className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CampaignDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <CampaignDetailsContent />
    </div>
  )
}

