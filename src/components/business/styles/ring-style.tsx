import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'

interface RingStyleProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  primaryColor: string
  secondaryColor: string
  name: string
  targetDate: string
  progress: number
}

export function RingStyle({ 
  days, hours, minutes, seconds, primaryColor, secondaryColor, name, targetDate, progress 
}: RingStyleProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const progressDeg = animatedProgress * 360
  const isLargeProgress = animatedProgress > 0.5

  return (
    <View className="p-4 rounded-2xl" style={{ backgroundColor: primaryColor + '08' }}>
      {/* Header */}
      <View className="flex items-center justify-between mb-2">
        <View>
          <Text className="block text-lg font-bold" style={{ color: primaryColor }}>{name}</Text>
          <Text className="block text-xs text-gray-500 mt-1">{formatDate(targetDate)}</Text>
        </View>
      </View>

      {/* Ring + Time */}
      <View className="flex items-center justify-between">
        {/* Ring - 使用 View 替代 SVG */}
        <View className="relative" style={{ width: '120px', height: '120px' }}>
          <View 
            className="absolute inset-0 rounded-full border-8"
            style={{ borderColor: '#E5E7EB' }}
          />
          {/* 圆环进度 */}
          <View 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <View 
              className="absolute inset-0"
              style={{
                background: `conic-gradient(${primaryColor} 0deg, ${secondaryColor} ${progressDeg}deg, transparent ${progressDeg}deg)`,
              }}
            >
              <View 
                className="absolute inset-0 rounded-full m-1.5"
                style={{ backgroundColor: primaryColor + '08' }}
              />
            </View>
          </View>
          {/* Center */}
          <View className="absolute inset-0 flex flex-col items-center justify-center">
            <Text className="text-3xl font-bold" style={{ color: primaryColor }}>{days}</Text>
            <Text className="text-xs text-gray-500">天</Text>
          </View>
        </View>

        {/* Time */}
        <View className="flex-1 ml-4">
          <View className="flex items-center justify-end gap-2 mb-2">
            <TimeBlock value={hours} label="时" color={primaryColor} />
            <Text className="text-lg" style={{ color: primaryColor }}>:</Text>
            <TimeBlock value={minutes} label="分" color={primaryColor} />
            <Text className="text-lg" style={{ color: primaryColor }}>:</Text>
            <TimeBlock value={seconds} label="秒" color={primaryColor} />
          </View>
        </View>
      </View>
    </View>
  )
}

function TimeBlock({ value, label, color }: { value: number; label: string; color: string }) {
  const str = value.toString().padStart(2, '0')
  return (
    <View className="text-center">
      <Text className="text-xl font-bold" style={{ color }}>{str}</Text>
      <Text className="block text-xs text-gray-400">{label}</Text>
    </View>
  )
}
