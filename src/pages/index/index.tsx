import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FlipCard } from '@/components/business/flip-card'
import { ProgressRing } from '@/components/business/progress-ring'
import { Calendar, Plus, Trash2 } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useCountdownStore } from '@/store/countdown'
import { useThemeStore, themes } from '@/store/theme'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  progress: number
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const total = Math.max(0, target - now)
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)
  
  // 计算进度（假设从创建时间到目标时间）
  const created = new Date().getTime()
  const totalDuration = target - created
  const progress = totalDuration > 0 ? 1 - (total / totalDuration) : 1
  
  return { days, hours, minutes, seconds, total, progress }
}

function CountdownCard({ 
  id, 
  name, 
  targetDate, 
  themeId,
  onDelete 
}: { 
  id: string
  name: string
  targetDate: string
  themeId: string
  onDelete: (id: string) => void
}) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(targetDate)
  )

  const themeConfig = themes[themeId] || themes.default

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <Card 
      className="overflow-hidden mb-4"
      style={{ 
        backgroundColor: themeConfig.bg,
        borderColor: themeConfig.primary + '20'
      }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text 
              className="block text-xl font-bold"
              style={{ color: themeConfig.text }}
            >
              {name}
            </Text>
            <Text className="block text-sm text-gray-500 mt-1">
              {formatDate(targetDate)}
            </Text>
          </View>
          <View
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={18} color="#EF4444" />
          </View>
        </View>

        {/* Countdown Display */}
        <View className="flex items-center gap-6">
          {/* Progress Ring */}
          <ProgressRing
            progress={timeRemaining.progress}
            size={80}
            strokeWidth={4}
            primaryColor={themeConfig.primary}
            secondaryColor={themeConfig.secondary}
          />

          {/* Time Cards */}
          <View className="flex-1">
            {/* Days */}
            <View className="mb-3">
              <Text 
                className="block text-xs font-medium mb-1"
                style={{ color: themeConfig.text }}
              >
                天
              </Text>
              <FlipCard 
                value={timeRemaining.days} 
                themeColor={themeConfig.primary}
              />
            </View>

            {/* Hours : Minutes : Seconds */}
            <View className="flex items-center gap-2">
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: themeConfig.text }}
                >
                  时
                </Text>
                <FlipCard 
                  value={timeRemaining.hours} 
                  themeColor={themeConfig.primary}
                />
              </View>
              <Text 
                className="block text-2xl font-bold mt-4"
                style={{ color: themeConfig.primary }}
              >
                :
              </Text>
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: themeConfig.text }}
                >
                  分
                </Text>
                <FlipCard 
                  value={timeRemaining.minutes} 
                  themeColor={themeConfig.primary}
                />
              </View>
              <Text 
                className="block text-2xl font-bold mt-4"
                style={{ color: themeConfig.primary }}
              >
                :
              </Text>
              <View>
                <Text 
                  className="block text-xs font-medium mb-1"
                  style={{ color: themeConfig.text }}
                >
                  秒
                </Text>
                <FlipCard 
                  value={timeRemaining.seconds} 
                  themeColor={themeConfig.primary}
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
  const { countdowns, loadCountdowns, removeCountdown, loaded } = useCountdownStore()
  const { loadTheme } = useThemeStore()

  useEffect(() => {
    loadCountdowns()
    loadTheme()
  }, [])

  const handleDelete = async (id: string) => {
    const res = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个倒计时吗？'
    })
    if (res.confirm) {
      await removeCountdown(id)
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
          className="p-3 rounded-full bg-primary shadow-lg"
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
              id={countdown.id}
              name={countdown.name}
              targetDate={countdown.targetDate}
              themeId={countdown.theme}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}
    </View>
  )
}
