import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Campaign {
  id: string
  title: string
  description: string
  goal: bigint
  amountRaised: bigint
  deadline: number
  creator: string
  contractAddress: string
  status: 'active' | 'successful' | 'failed'
  category: string
  imageUrl?: string
}

interface CampaignStore {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  loading: boolean
  error: string | null
  
  setCampaigns: (campaigns: Campaign[]) => void
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  selectCampaign: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      selectedCampaign: null,
      loading: false,
      error: null,

      setCampaigns: (campaigns) => set({ campaigns, error: null }),
      
      addCampaign: (campaign) => 
        set((state) => ({ 
          campaigns: [...state.campaigns, campaign],
          error: null 
        })),
      
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          selectedCampaign:
            state.selectedCampaign?.id === id
              ? { ...state.selectedCampaign, ...updates }
              : state.selectedCampaign,
        })),
      
      selectCampaign: (id) => {
        const campaign = get().campaigns.find((c) => c.id === id)
        set({ selectedCampaign: campaign || null })
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'campaign-storage',
      partialize: (state) => ({ campaigns: state.campaigns }),
    }
  )
)
