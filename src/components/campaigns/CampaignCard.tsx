// src/components/campaigns/CampaignCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Target, TrendingUp, Users } from 'lucide-react'
import { formatEther } from 'viem'

interface CampaignCardProps {
  campaign: {
    id: string
    title: string
    description: string
    goal: bigint
    amountRaised: bigint
    deadline: number
    creator: string
    imageUrl?: string
    category: string
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Number((campaign.amountRaised * 100n) / campaign.goal)
  const daysLeft = Math.max(
    0,
    Math.floor((campaign.deadline - Date.now() / 1000) / 86400)
  )
  const goalEth = formatEther(campaign.goal)
  const raisedEth = formatEther(campaign.amountRaised)

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Campaign Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Target className="w-16 h-16 text-blue-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {campaign.category}
            </span>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {campaign.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-900">
                {raisedEth} ETH
              </span>
              <span className="text-gray-500">
                {progress.toFixed(0)}% funded
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Goal</p>
                <p className="text-sm font-semibold text-gray-900">
                  {goalEth} ETH
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Days Left</p>
                <p className="text-sm font-semibold text-gray-900">
                  {daysLeft}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Backers</p>
                <p className="text-sm font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}