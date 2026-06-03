import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FlipCard } from '@/components/business/flip-card'
import { ProgressRing } from '@/components/business/progress-ring'
import { Calendar, Plus, Trash2 } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface Countdown {
  id: string
  name: string
  targetDate: string
  theme: string
  primaryColor: string
  secondaryColor: string
  bgColor: string
  createdAt: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  progress: number
}

const defaultColors = {
  default: { primary: '#6366F1', secondary: '#8B5CF6', bg: '#F8FAFC' },
  birthday: { primary: '#F97316', secondary: '#FB923C', bg: '#FFFBEB' },
  travel: { primary: '#3B82F6', secondary: '#60A5FA', bg: '#EFF6FF' },
  festival: { primary: '#EF4444', secondary: '#F87171', bg: '#FEF2F2' }
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const total = Math.max(0, target - now)
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)
  
  const progress = 0.65
  
  return { days, hours, minutes, seconds, total, progress }
}

function CountdownCard({ 
  countdown,
  onDelete 
}: { 
  countdown: Countdown
  onDelete: (id: string) => void
}) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(countdown.targetDate)
  )

  // 获取主题颜色，优先使用自定义颜色
  const getThemeColors = () => {
    if (countdown.primaryColor && countdown.secondaryColor) {
      return {
        primary: countdown.primaryColor,
        secondary: countdown.secondaryColor,
        bg: countdown.bgColor || '#F8FAFC'
      }
    }
    return defaultColors[countdown.theme as keyof typeof defaultColors] || defaultColors.default
  }

  const colors = getThemeColors()

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(countdown.targetDate))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [countdown.targetDate])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <Card 
      className="overflow-hidden mb-4"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: colors.primary + '20'
      }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex items-center justify-between mb-4">
          <View>
            <Text 
              className="block text-xl font-bold"
              style={{ color: colors.primary }}
            >
              {countdown.name}
            </Text>
            <Text className="block text-sm text-gray-500 mt-1">
              {formatDate(countdown.targetDate)}
            </Text>
          </View>
          <View
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.primary + '15' }}
            onClick={() => onDelete(countdown.id)}
          >
            <Trash2 size={18} color="#EF4444" />
          </View>
        </View>

        {/* Countdown Display */}
        <View className="flex items-center gap-6">
          {/* Progress Ring with Center Number */}
          <View className="relative">
            <ProgressRing
              progress={timeRemaining.progress}
              size={90}
              strokeWidth={5}
              primaryColor={colors.primary}
              secondaryColor={colors.secondary}
            />
            {/* Center Number */}
            <View className="absolute inset-0 flex flex-col items-center justify-center">
              <Text 
                className="block text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                {timeRemaining.days}
              </Text>
              <Text className="block text-xs text-gray-500">天</Text>
            </View>
          </View>

          {/* Time Cards */}
          <View className="flex-1">
            <View className="flex items-center gap-2">
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: colors.primary }}
                >
                  时
                </Text>
                <FlipCard 
                  value={timeRemaining.hours} 
                  themeColor={colors.primary}
                />
              </View>
              <Text 
                className="block text-2xl font-bold mt-4"
                style={{ color: colors.primary }}
              >
                :
              </Text>
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: colors.primary }}
                >
                  分
                </Text>
                <FlipCard 
                  value={timeRemaining.minutes} 
                  themeColor={colors.primary}
                />
              </View>
              <Text 
                className="block text-2xl font-bold mt-4"
                style={{ color: colors.primary }}
              >
                :
              </Text>
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: colors.primary }}
                >
                  秒
                </Text>
                <FlipCard 
                  value={timeRemaining.seconds} 
                  themeColor={colors.primary}
                />
              </View>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}

export default function IndexPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadCountdowns()
  }, [])

  // 页面显示时重新加载数据
  Taro.useDidShow(() => {
    loadCountdowns()
  })

  const loadCountdowns = () => {
    try {
      const data = Taro.getStorageSync('countdown_data') || []
      setCountdowns(data)
    } catch {
      setCountdowns([])
    }
    setLoaded(true)
  }

  const handleDelete = async (id: string) => {
    const res = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个倒计时吗？'
    })
    if (res.confirm) {
      const newData = countdowns.filter(c => c.id !== id)
      setCountdowns(newData)
      Taro.setStorageSync('countdown_data', newData)
    }
  }

  const handleAdd = () => {
    Taro.switchTab({ url: '/pages/add/index' })
  }

  if (!loaded) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="block text-gray-400">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <View className="flex items-center justify-between mb-6">
        <View>
          <Text className="block text-2xl font-bold text-gray-800">我的倒计时</Text>
          <Text className="block text-sm text-gray-500 mt-1">
            记录每一个重要时刻
          </Text>
        </View>
        <View 
          className="p-3 rounded-full shadow-lg"
          style={{ backgroundColor: '#6366F1' }}
          onClick={handleAdd}
        >
          <Plus size={24} color="#fff" />
        </View>
      </View>

      {/* Countdown List */}
      {countdowns.length === 0 ? (
        <Card className="mt-20">
          <CardContent className="p-12 flex flex-col items-center">
            <View className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar size={40} color="#9CA3AF" />
            </View>
            <Text className="block text-lg font-medium text-gray-700 mb-2">
              还没有倒计时
            </Text>
            <Text className="block text-sm text-gray-500 mb-6">
              点击右上角 + 添加你的第一个倒计时
            </Text>
            <Button onClick={handleAdd}>
              <Text className="text-white">添加倒计时</Text>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <View>
          {countdowns.map((countdown) => (
            <CountdownCard
              key={countdown.id}
              countdown={countdown}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}
    </View>
  )
}
