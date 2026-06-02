import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useThemeStore } from '@/store/theme'

export default function ThemePage() {
  const { currentTheme, setTheme } = useThemeStore()

  const themes = [
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

  const handleApplyTheme = (themeId: string) => {
    setTheme(themeId)
    Taro.showToast({ title: '主题已应用', icon: 'success' })
  }

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="block text-2xl font-bold text-gray-800">主题皮肤</Text>
        <Text className="block text-sm text-gray-500 mt-1">选择你喜欢的主题风格</Text>
      </View>

      {/* Theme Cards */}
      <View className="space-y-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id}
            className={`overflow-hidden transition-all ${
              currentTheme === theme.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
          >
            <CardContent className="p-0">
              {/* Theme Preview */}
              <View 
                className="h-32 relative"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Progress Ring Preview */}
                <View className="absolute left-6 top-1/2 -translate-y-1/2">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <defs>
                      <linearGradient id={`gradient-${theme.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={theme.primary} />
                        <stop offset="100%" stopColor={theme.secondary} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke={`url(#gradient-${theme.id})`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${0.65 * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                </View>

                {/* Flip Card Preview */}
                <View className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
                  <View 
                    className="w-10 h-14 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Text className="block text-white text-xl font-bold">0</Text>
                  </View>
                  <View 
                    className="w-10 h-14 rounded-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Text className="block text-white text-xl font-bold">7</Text>
                  </View>
                </View>

                {/* Current Theme Badge */}
                {currentTheme === theme.id && (
                  <View className="absolute top-3 right-3 bg-primary rounded-full p-1">
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>

              {/* Theme Info */}
              <View className="p-4 bg-white">
                <View className="flex items-center justify-between">
                  <View>
                    <Text className="block text-lg font-semibold" style={{ color: theme.text }}>
                      {theme.name}
                    </Text>
                    <Text className="block text-sm text-gray-500 mt-1">
                      {theme.description}
                    </Text>
                  </View>
                  <Button
                    size="sm"
                    variant={currentTheme === theme.id ? 'default' : 'outline'}
                    onClick={() => handleApplyTheme(theme.id)}
                    style={currentTheme === theme.id ? { backgroundColor: theme.primary } : {}}
                  >
                    <Text className={currentTheme === theme.id ? 'text-white' : ''}>
                      {currentTheme === theme.id ? '使用中' : '应用'}
                    </Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  )
}
