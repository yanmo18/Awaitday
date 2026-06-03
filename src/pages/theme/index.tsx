import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Palette } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface ThemeOption {
  id: string
  name: string
  description: string
  bg: string
  primary: string
  secondary: string
  text: string
  isCustom?: boolean
}

export default function ThemePage() {
  const [currentTheme, setCurrentTheme] = useState('default')
  const [customPrimary, setCustomPrimary] = useState('#6366F1')
  const [customSecondary, setCustomSecondary] = useState('#8B5CF6')

  const presetThemes: ThemeOption[] = [
    {
      id: 'default',
      name: '晨光白',
      description: '优雅的靛蓝紫配色',
      bg: '#F8FAFC',
      primary: '#6366F1',
      secondary: '#8B5CF6',
      text: '#1E293B'
    },
    {
      id: 'birthday',
      name: '蜜橙暖阳',
      description: '温暖的橙色调，适合生日',
      bg: '#FFFBEB',
      primary: '#F97316',
      secondary: '#FB923C',
      text: '#78350F'
    },
    {
      id: 'travel',
      name: '天际蓝',
      description: '清新的蓝色，适合出行',
      bg: '#EFF6FF',
      primary: '#3B82F6',
      secondary: '#60A5FA',
      text: '#1E3A8A'
    },
    {
      id: 'festival',
      name: '喜庆红',
      description: '热闹的红色，适合节日',
      bg: '#FEF2F2',
      primary: '#EF4444',
      secondary: '#F87171',
      text: '#7F1D1D'
    }
  ]

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#78716C'
  ]

  useEffect(() => {
    // 加载保存的主题
    const savedTheme = Taro.getStorageSync('theme_setting')
    if (savedTheme) {
      setCurrentTheme(savedTheme.id || 'default')
      if (savedTheme.customPrimary) setCustomPrimary(savedTheme.customPrimary)
      if (savedTheme.customSecondary) setCustomSecondary(savedTheme.customSecondary)
    }
  }, [])

  const handleApplyTheme = (themeId: string) => {
    const themeData = getThemeData(themeId)
    
    // 保存主题设置
    Taro.setStorageSync('theme_setting', {
      id: themeId,
      customPrimary: themeData.primary,
      customSecondary: themeData.secondary
    })
    
    setCurrentTheme(themeId)
    Taro.showToast({ title: '主题已应用', icon: 'success' })
  }

  const getThemeData = (themeId: string): ThemeOption => {
    if (themeId === 'custom') {
      return {
        id: 'custom',
        name: '自定义',
        description: '你自己的配色方案',
        bg: '#F8FAFC',
        primary: customPrimary,
        secondary: customSecondary,
        text: '#1E293B',
        isCustom: true
      }
    }
    return presetThemes.find(t => t.id === themeId) || presetThemes[0]
  }

  const allThemes: ThemeOption[] = [...presetThemes, {
    id: 'custom',
    name: '自定义',
    description: '你自己的配色方案',
    bg: '#F8FAFC',
    primary: customPrimary,
    secondary: customSecondary,
    text: '#1E293B',
    isCustom: true
  }]

  return (
    <View className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <View className="mb-6">
        <Text className="block text-2xl font-bold text-gray-800">主题皮肤</Text>
        <Text className="block text-sm text-gray-500 mt-1">选择你喜欢的主题风格</Text>
      </View>

      {/* Theme Cards */}
      <View className="space-y-4">
        {allThemes.map((theme) => (
          <Card 
            key={theme.id}
            className="overflow-hidden"
            style={{
              borderWidth: 2,
              borderColor: currentTheme === theme.id ? theme.primary : '#E5E7EB'
            }}
          >
            <CardContent className="p-0">
              {/* Theme Preview */}
              <View 
                className="h-36 relative flex items-center justify-center"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Progress Ring with Countdown Number */}
                <View className="relative">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <defs>
                      <linearGradient id={`gradient-${theme.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={theme.primary} />
                        <stop offset="100%" stopColor={theme.secondary} />
                      </linearGradient>
                    </defs>
                    {/* Background Ring */}
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="5"
                    />
                    {/* Progress Ring */}
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke={`url(#gradient-${theme.id})`}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${0.65 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                      transform="rotate(-90 40 40)"
                    />
                    {/* Center Text */}
                    <text 
                      x="40" 
                      y="36" 
                      textAnchor="middle" 
                      fill={theme.primary} 
                      fontSize="22" 
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      07
                    </text>
                    <text 
                      x="40" 
                      y="52" 
                      textAnchor="middle" 
                      fill={theme.text}
                      fontSize="10"
                      opacity="0.6"
                    >
                      天
                    </text>
                  </svg>
                  
                  {/* Current Theme Badge */}
                  {currentTheme === theme.id && (
                    <View 
                      className="absolute -top-1 -right-1 rounded-full p-1"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check size={14} color="#fff" />
                    </View>
                  )}
                </View>

                {/* Flip Card Preview */}
                <View className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <View 
                    className="w-8 h-12 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Text className="block text-white text-lg font-bold">1</Text>
                  </View>
                  <View 
                    className="w-8 h-12 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Text className="block text-white text-lg font-bold">2</Text>
                  </View>
                </View>
              </View>

              {/* Theme Info */}
              <View className="p-4 bg-white">
                <View className="flex items-center justify-between">
                  <View className="flex-1">
                    <View className="flex items-center gap-2">
                      <Text className="block text-lg font-semibold" style={{ color: theme.text }}>
                        {theme.name}
                      </Text>
                      {theme.isCustom && (
                        <Palette size={16} color={theme.primary} />
                      )}
                    </View>
                    <Text className="block text-sm text-gray-500 mt-1">
                      {theme.description}
                    </Text>
                  </View>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: currentTheme === theme.id ? theme.primary : 'transparent',
                      borderColor: theme.primary,
                      borderWidth: 1
                    }}
                    onClick={() => handleApplyTheme(theme.id)}
                  >
                    <Text style={{ color: currentTheme === theme.id ? '#fff' : theme.primary }}>
                      {currentTheme === theme.id ? '使用中' : '应用'}
                    </Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Custom Color Picker */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <Text className="block text-base font-semibold text-gray-800 mb-4">自定义颜色</Text>
          
          <Text className="block text-sm text-gray-600 mb-2">主色调</Text>
          <View className="flex flex-wrap gap-2 mb-4">
            {colors.map((color) => (
              <View
                key={`primary-${color}`}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: color,
                  borderWidth: customPrimary === color ? 3 : 0,
                  borderColor: '#1F2937'
                }}
                onClick={() => {
                  setCustomPrimary(color)
                  if (currentTheme === 'custom') {
                    handleApplyTheme('custom')
                  }
                }}
              >
                {customPrimary === color && (
                  <Check size={16} color="#fff" />
                )}
              </View>
            ))}
          </View>
          
          <Text className="block text-sm text-gray-600 mb-2">渐变色</Text>
          <View className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <View
                key={`secondary-${color}`}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: color,
                  borderWidth: customSecondary === color ? 3 : 0,
                  borderColor: '#1F2937'
                }}
                onClick={() => {
                  setCustomSecondary(color)
                  if (currentTheme === 'custom') {
                    handleApplyTheme('custom')
                  }
                }}
              >
                {customSecondary === color && (
                  <Check size={16} color="#fff" />
                )}
              </View>
            ))}
          </View>

          {/* Gradient Preview */}
          <View className="mt-4 flex items-center gap-3">
            <View 
              className="w-16 h-16 rounded-full shadow-lg"
              style={{ background: `linear-gradient(135deg, ${customPrimary}, ${customSecondary})` }}
            />
            <View>
              <Text className="block text-sm font-medium text-gray-700">渐变预览</Text>
              <Text className="block text-xs text-gray-500 mt-1">
                {customPrimary} → {customSecondary}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}
