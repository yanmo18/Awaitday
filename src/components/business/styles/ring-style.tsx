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
  progress?: number
}

export function RingStyle({ 
  days, hours, minutes, seconds, primaryColor, secondaryColor, name, targetDate, progress = 0.7
}: RingStyleProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const size = 120
  const strokeWidth = 8
  const innerSize = size - strokeWidth * 2
  const segments = 24

  const getSegmentColor = (index: number) => {
    const totalProgress = animatedProgress * segments
    if (index >= totalProgress) return 'transparent'
    const ratio = index / (segments - 1)
    return getGradientColor(primaryColor, secondaryColor, ratio)
  }

  return (
    <View className="p-4 rounded-2xl" style={{ backgroundColor: primaryColor + '08' }}>
      <View className="flex items-center justify-between mb-2">
        <View>
          <Text className="block text-lg font-bold" style={{ color: primaryColor }}>{name}</Text>
          <Text className="block text-xs text-gray-500 mt-1">{formatDate(targetDate)}</Text>
        </View>
      </View>

      <View className="flex items-center justify-between">
        {/* Ring - 使用多个扇形段实现平滑渐变圆环 */}
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
          {/* 渐变进度圆环 - 由多个扇形段组成 */}
          {Array.from({ length: segments }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderTopColor: getSegmentColor(i),
                transform: `rotate(${i * (360 / segments) - 90}deg)`,
              }}
            />
          ))}
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

function getGradientColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.substring(0, 2), 16)
  const g1 = parseInt(hex1.substring(2, 4), 16)
  const b1 = parseInt(hex1.substring(4, 6), 16)
  
  const r2 = parseInt(hex2.substring(0, 2), 16)
  const g2 = parseInt(hex2.substring(2, 4), 16)
  const b2 = parseInt(hex2.substring(4, 6), 16)
  
  if (isNaN(r1) || isNaN(g1) || isNaN(b1) || isNaN(r2) || isNaN(g2) || isNaN(b2)) {
    return ratio < 0.5 ? color1 : color2
  }
  
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function TimeBlock({ value, label, color }: { value: number; label: string; color: string }) {
  const str = value.toString().padStart(2, '0')
  return (
    <View className="text-center">
      <Text className="text-xl font-bold" style={{ color }}>{str}</Text>
      <Text className="text-xs text-gray-400">{label}</Text>
    </View>
  )
}
