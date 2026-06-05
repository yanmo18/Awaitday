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

  // 圆环尺寸
  const size = 120
  const strokeWidth = 8
  const innerSize = size - strokeWidth * 2

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
        {/* Ring - 使用多个 View 模拟圆环 */}
        <View 
          className="relative flex items-center justify-center"
          style={{
            width: size,
            height: size,
          }}
        >
          {/* 背景圆环 */}
          <View 
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderStyle: 'solid',
              borderColor: '#E5E7EB',
            }}
          />
          {/* 进度圆环 - 使用 border 模拟 */}
          <View 
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderStyle: 'solid',
              borderTopColor: primaryColor,
              borderRightColor: animatedProgress > 0.25 ? primaryColor : 'transparent',
              borderBottomColor: animatedProgress > 0.5 ? secondaryColor : 'transparent',
              borderLeftColor: animatedProgress > 0.75 ? secondaryColor : 'transparent',
              transform: `rotate(${animatedProgress * 360 - 90}deg)`,
            }}
          />
          {/* 内部白色圆 */}
          <View 
            style={{
              position: 'absolute',
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
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
