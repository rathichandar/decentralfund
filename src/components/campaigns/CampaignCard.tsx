// src/components/campaigns/CampaignCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Target, TrendingUp, Users, ArrowUpRight } from 'lucide-react'
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
      <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 hover:border-purple-200">
        {/* Campaign Image */}
        <div className="relative h-56 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
              <Target className="w-20 h-20 text-white/50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-purple-600 shadow-lg border border-purple-100">
              {campaign.category}
            </span>
          </div>
          
          {/* View Button on Hover */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/95 backdrop-blur-md p-2 rounded-full shadow-lg">
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
            {campaign.title}
          </h3>
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2.5">
              <span className="font-bold text-gray-900 text-base">
                {raisedEth.slice(0, 6)} ETH
              </span>
              <span className="text-gray-500 font-semibold">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1.5 font-medium">
              Goal: {goalEth.slice(0, 6)} ETH
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Days Left</p>
                <p className="text-base font-bold text-gray-900">
                  {daysLeft}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Backers</p>
                <p className="text-base font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}