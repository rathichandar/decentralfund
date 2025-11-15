'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { CROWDFUNDING_FACTORY_ADDRESS, CROWDFUNDING_FACTORY_ABI } from '@/contracts'
import { Loader2, Upload, AlertCircle } from 'lucide-react'
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Wallet Not Connected
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to create a campaign
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Campaign
          </h1>
          <p className="text-xl text-gray-600">
            Launch your crowdfunding campaign on the blockchain
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Revolutionary Solar Panel Technology"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your campaign, goals, and how funds will be used..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Goal and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.goal ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 10"
              />
              {errors.goal && (
                <p className="mt-1 text-sm text-red-600">{errors.goal}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 30"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Provide a URL to an image for your campaign (or leave blank for default)
            </p>
          </div>

          {/* Transaction Fee Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Creating a campaign requires a small transaction fee (gas) paid in SepoliaETH.
              Make sure you have enough balance in your wallet.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isPending ? 'Waiting for approval...' : 'Creating campaign...'}
              </>
            ) : (
              'Create Campaign'
            )}
          </button>

          {hash && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Transaction submitted!{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  View on explorer
                </a>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}