import { create } from 'zustand'

interface Transaction {
  hash: string
  type: 'create_campaign' | 'contribute' | 'withdraw' | 'refund'
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  data?: any
  error?: string
}

interface TransactionStore {
  transactions: Transaction[]
  pendingCount: number
  
  addTransaction: (tx: Omit<Transaction, 'timestamp'>) => void
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void
  removeTransaction: (hash: string) => void
  getPendingTransactions: () => Transaction[]
  clearOldTransactions: () => void
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  pendingCount: 0,

  addTransaction: (tx) => {
    const transaction: Transaction = {
      ...tx,
      timestamp: Date.now(),
    }
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      pendingCount: tx.status === 'pending' 
        ? state.pendingCount + 1 
        : state.pendingCount,
    }))
  },

  updateTransaction: (hash, updates) => {
    set((state) => {
      const oldTx = state.transactions.find((tx) => tx.hash === hash)
      const newPendingCount =
        oldTx?.status === 'pending' && updates.status !== 'pending'
          ? state.pendingCount - 1
          : state.pendingCount

      return {
        transactions: state.transactions.map((tx) =>
          tx.hash === hash ? { ...tx, ...updates } : tx
        ),
        pendingCount: Math.max(0, newPendingCount),
      }
    })
  },

  removeTransaction: (hash) => {
    set((state) => {
      const tx = state.transactions.find((t) => t.hash === hash)
      return {
        transactions: state.transactions.filter((tx) => tx.hash !== hash),
        pendingCount:
          tx?.status === 'pending'
            ? state.pendingCount - 1
            : state.pendingCount,
      }
    })
  },

  getPendingTransactions: () => {
    return get().transactions.filter((tx) => tx.status === 'pending')
  },

  clearOldTransactions: () => {
    const oneDayAgo = Date.now() - 86400000
    set((state) => ({
      transactions: state.transactions.filter(
        (tx) => tx.timestamp > oneDayAgo || tx.status === 'pending'
      ),
    }))
  },
}))
