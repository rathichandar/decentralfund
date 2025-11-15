'use client'

import { useState } from 'react'
import { useTransactionStore } from '@/stores/transactionStore'
import toast from 'react-hot-toast'

interface UseTransactionOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useTransaction(options: UseTransactionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const { addTransaction, updateTransaction } = useTransactionStore()

  const executeTransaction = async (
    config: any,
    type: string
  ) => {
    setIsLoading(true)
    let txHash: string | undefined

    try {
      const hash = 'mock-tx-hash-' + Date.now()
      txHash = hash

      addTransaction({
        hash,
        type: type as any,
        status: 'pending',
        data: config,
      })

      toast.loading('Transaction pending...', { id: hash })

      await new Promise(resolve => setTimeout(resolve, 2000))

      updateTransaction(hash, {
        status: 'confirmed',
      })

      toast.success(options.successMessage || 'Transaction confirmed!', {
        id: hash,
      })
      options.onSuccess?.({ hash })

      return { hash }
    } catch (error: any) {
      console.error('Transaction error:', error)
      
      if (txHash) {
        updateTransaction(txHash, {
          status: 'failed',
          error: error.message,
        })
        toast.error(error.message || 'Transaction failed', { id: txHash })
      } else {
        toast.error(options.errorMessage || 'Transaction failed')
      }
      
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    executeTransaction,
    isLoading,
  }
}
