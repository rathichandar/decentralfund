'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI } from '@/contracts'
import { Loader2, Upload, AlertCircle, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateCampaignPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    duration: '30',
    category: 'Technology',
    imageUrl: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Redirect on success
  if (isSuccess) {
    toast.success('Campaign created successfully!')
    setTimeout(() => router.push('/campaigns'), 2000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!formData.goal) {
      newErrors.goal = 'Goal amount is required'
    } else {
      const goalNum = parseFloat(formData.goal)
      if (isNaN(goalNum) || goalNum <= 0) {
        newErrors.goal = 'Goal must be a positive number'
      } else if (goalNum < 0.01) {
        newErrors.goal = 'Goal must be at least 0.01 ETH'
      }
    }

    const durationNum = parseInt(formData.duration)
    if (isNaN(durationNum) || durationNum < 1) {
      newErrors.duration = 'Duration must be at least 1 day'
    } else if (durationNum > 365) {
      newErrors.duration = 'Duration cannot exceed 365 days'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    try {
      const goalInWei = parseEther(formData.goal)
      const durationInDays = BigInt(formData.duration)

      writeContract({
        address: CROWDFUNDING_FACTORY_ADDRESS,
        abi: CROWDFUNDING_FACTORY_ABI,
        functionName: 'createCampaign',
        args: [
          formData.title,
          formData.description,
          goalInWei,
          durationInDays,
          formData.category,
          formData.imageUrl || 'https://via.placeholder.com/400x200?text=Campaign+Image',
        ],
      })
    } catch (error: any) {
      console.error('Error creating campaign:', error)
      toast.error(error.message || 'Failed to create campaign')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Wallet Not Connected</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Please connect your wallet to create a campaign and start raising funds
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 inline-block">
              👆 Click "Connect Wallet" in the navigation bar above
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-full px-5 py-2 mb-6">
            <Upload className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-purple-700">Launch Your Vision</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="gradient-text">Create Campaign</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Launch your crowdfunding campaign on the blockchain and bring your ideas to life
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200">
          {/* Title */}
          <div className="mb-7">
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-medium ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
              }`}
              placeholder="e.g., Revolutionary Solar Panel Technology"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-7">
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-medium resize-none ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
              }`}
              placeholder="Describe your campaign, goals, and how funds will be used..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.description}
              </p>
            )}
          </div>

          {/* Goal and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <div>
              <label htmlFor="goal" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Funding Goal (ETH) *
              </label>
              <input
                type="number"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-bold text-lg ${
                  errors.goal ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                }`}
                placeholder="e.g., 10"
              />
              {errors.goal && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.goal}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Duration (Days) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="365"
                className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-bold text-lg ${
                  errors.duration ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-300'
                }`}
                placeholder="e.g., 30"
              />
              {errors.duration && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.duration}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-7">
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-semibold hover:border-purple-300 cursor-pointer bg-white"
            >
              <option value="Technology">🚀 Technology</option>
              <option value="Art">🎨 Art</option>
              <option value="Education">📚 Education</option>
              <option value="Health">❤️ Health</option>
              <option value="Environment">🌍 Environment</option>
              <option value="Other">✨ Other</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="mb-7">
            <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Image URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-5 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-medium hover:border-purple-300"
                placeholder="https://example.com/image.jpg"
              />
              <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Provide a URL to an image for your campaign (or leave blank for default)
            </p>
          </div>

          {/* Transaction Fee Notice */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-purple-900 font-semibold mb-1">
                  Transaction Fee Required
                </p>
                <p className="text-sm text-purple-700">
                  Creating a campaign requires a small transaction fee (gas) paid in SepoliaETH.
                  Make sure you have enough balance in your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {isPending ? 'Waiting for approval...' : 'Creating campaign...'}
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                Create Campaign
              </>
            )}
          </button>

          {hash && (
            <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-green-900 font-bold mb-1">
                    Transaction submitted!
                  </p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 underline font-semibold hover:text-green-900"
                  >
                    View on block explorer →
                  </a>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}