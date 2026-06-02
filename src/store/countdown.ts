import { create } from 'zustand'
import Taro from '@tarojs/taro'

export interface Countdown {
  id: string
  name: string
  targetDate: string
  theme: string
  createdAt: string
}

interface CountdownState {
  countdowns: Countdown[]
  loaded: boolean
  loadCountdowns: () => Promise<void>
  addCountdown: (countdown: Omit<Countdown, 'id' | 'createdAt'>) => Promise<void>
  removeCountdown: (id: string) => Promise<void>
  updateCountdown: (id: string, data: Partial<Countdown>) => Promise<void>
}

const STORAGE_KEY = 'countdown_data'

export const useCountdownStore = create<CountdownState>((set, get) => ({
  countdowns: [],
  loaded: false,

  loadCountdowns: async () => {
    try {
      const res = await Taro.getStorage({ key: STORAGE_KEY })
      const countdowns = res.data || []
      set({ countdowns, loaded: true })
    } catch {
      set({ countdowns: [], loaded: true })
    }
  },

  addCountdown: async (countdown) => {
    const newCountdown: Countdown = {
      ...countdown,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const countdowns = [...get().countdowns, newCountdown]
    set({ countdowns })
    await Taro.setStorage({ key: STORAGE_KEY, data: countdowns })
  },

  removeCountdown: async (id) => {
    const countdowns = get().countdowns.filter(c => c.id !== id)
    set({ countdowns })
    await Taro.setStorage({ key: STORAGE_KEY, data: countdowns })
  },

  updateCountdown: async (id, data) => {
    const countdowns = get().countdowns.map(c => 
      c.id === id ? { ...c, ...data } : c
    )
    set({ countdowns })
    await Taro.setStorage({ key: STORAGE_KEY, data: countdowns })
  }
}))
