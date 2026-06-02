import { create } from 'zustand'
import Taro from '@tarojs/taro'

export interface ThemeConfig {
  id: string
  name: string
  bg: string
  primary: string
  secondary: string
  text: string
}

export const themes: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: '晨光白',
    bg: '#F8FAFC',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    text: '#1E293B'
  },
  birthday: {
    id: 'birthday',
    name: '蜜橙暖阳',
    bg: '#FFFBEB',
    primary: '#F97316',
    secondary: '#FB923C',
    text: '#78350F'
  },
  travel: {
    id: 'travel',
    name: '天际蓝',
    bg: '#EFF6FF',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    text: '#1E3A8A'
  },
  festival: {
    id: 'festival',
    name: '喜庆红',
    bg: '#FEF2F2',
    primary: '#EF4444',
    secondary: '#F87171',
    text: '#7F1D1D'
  }
}

interface ThemeState {
  currentTheme: string
  themeConfig: ThemeConfig
  setTheme: (themeId: string) => Promise<void>
  loadTheme: () => Promise<void>
}

const STORAGE_KEY = 'theme_setting'

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'default',
  themeConfig: themes.default,

  loadTheme: async () => {
    try {
      const res = await Taro.getStorage({ key: STORAGE_KEY })
      const themeId = res.data || 'default'
      set({ 
        currentTheme: themeId, 
        themeConfig: themes[themeId] || themes.default 
      })
    } catch {
      set({ currentTheme: 'default', themeConfig: themes.default })
    }
  },

  setTheme: async (themeId: string) => {
    const config = themes[themeId] || themes.default
    set({ currentTheme: themeId, themeConfig: config })
    await Taro.setStorage({ key: STORAGE_KEY, data: themeId })
  }
}))
