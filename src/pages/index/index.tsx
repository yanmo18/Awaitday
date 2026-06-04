import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus, Trash2 } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

// Styles
import { FlipCardStyle } from '@/components/business/styles/flip-card-style'
import { RingStyle } from '@/components/business/styles/ring-style'
import { GradientStyle } from '@/components/business/styles/gradient-style'
import { MinimalStyle } from '@/components/business/styles/minimal-style'

interface Countdown {
  id: string
  name: string
  targetDate: string
  theme: string
  primaryColor: string
  secondaryColor: string
  bgColor: string
  style?: string
  createdAt: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
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
  
  return { days, hours, minutes, seconds, total }
}

function CountdownCard({ 
  countdown,
  globalStyle,
  onDelete 
}: { 
  countdown: Countdown
  globalStyle: string
  onDelete: (id: string) => void
}) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(countdown.targetDate)
  )

  // 获取主题颜色
  const getColors = () => {
    if (countdown.primaryColor && countdown.secondaryColor) {
      return {
        primary: countdown.primaryColor,
        secondary: countdown.secondaryColor
      }
    }
    return defaultColors[countdown.theme as keyof typeof defaultColors] || defaultColors.default
  }

  const colors = getColors()
  // 使用倒计时自己的样式，或全局样式
  const style = countdown.style || globalStyle

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(countdown.targetDate))
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [countdown.targetDate])

  // 根据样式渲染不同组件
  const renderCountdown = () => {
    switch (style) {
      case 'flip':
        return <FlipCardStyle 
          days={timeRemaining.days}
          hours={timeRemaining.hours}
          minutes={timeRemaining.minutes}
          seconds={timeRemaining.seconds}
          primaryColor={colors.primary}
          name={countdown.name}
          targetDate={countdown.targetDate}
        />
      case 'gradient':
        return <GradientStyle 
          days={timeRemaining.days}
          hours={timeRemaining.hours}
          minutes={timeRemaining.minutes}
          seconds={timeRemaining.seconds}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
          name={countdown.name}
          targetDate={countdown.targetDate}
        />
      case 'minimal':
        return <MinimalStyle 
          days={timeRemaining.days}
          hours={timeRemaining.hours}
          minutes={timeRemaining.minutes}
          seconds={timeRemaining.seconds}
          primaryColor={colors.primary}
          name={countdown.name}
          targetDate={countdown.targetDate}
        />
      case 'ring':
      default:
        return (
          <RingStyle 
            days={timeRemaining.days}
            hours={timeRemaining.hours}
            minutes={timeRemaining.minutes}
            seconds={timeRemaining.seconds}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            name={countdown.name}
            targetDate={countdown.targetDate}
            progress={0.65}
          />
        )
    }
  }

  return (
    <View className="mb-4 relative">
      {/* Delete Button */}
      <View
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 shadow-sm"
        onClick={() => onDelete(countdown.id)}
      >
        <Trash2 size={16} color="#EF4444" />
      </View>
      
      {renderCountdown()}
    </View>
  )
}

export default function IndexPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([])
  const [loaded, setLoaded] = useState(false)
  const [globalStyle, setGlobalStyle] = useState('ring')

  useEffect(() => {
    loadData()
  }, [])

  Taro.useDidShow(() => {
    loadData()
  })

  const loadData = () => {
    // 加载倒计时
    const data = Taro.getStorageSync('countdown_data') || []
    setCountdowns(data)
    
    // 加载全局样式
    const style = Taro.getStorageSync('countdown_style') || 'ring'
    setGlobalStyle(style)
    
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
          <Text className="block text-2xl font-bold text-gray-800">Awaitday</Text>
          <Text className="block text-sm text-gray-500 mt-1">
            记录每一个重要时刻
          </Text>
        </View>
        <View 
          className="flex items-center justify-center shadow-lg"
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '24px',
            backgroundColor: '#6366F1' 
          }}
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
              globalStyle={globalStyle}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}
    </View>
  )
}
