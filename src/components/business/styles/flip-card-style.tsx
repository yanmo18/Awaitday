import { View, Text } from '@tarojs/components'
import './flip-card.css'

interface FlipCardStyleProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  primaryColor: string
  name: string
  targetDate: string
}

export function FlipCardStyle({ 
  days, hours, minutes, seconds, primaryColor, name, targetDate 
}: FlipCardStyleProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <View className="p-4 rounded-2xl" style={{ backgroundColor: primaryColor + '08' }}>
      {/* Header */}
      <View className="flex items-center justify-between mb-4">
        <View>
          <Text className="block text-lg font-bold" style={{ color: primaryColor }}>{name}</Text>
          <Text className="block text-xs text-gray-500 mt-1">{formatDate(targetDate)}</Text>
        </View>
      </View>

      {/* Days - Large */}
      <View className="flex items-center justify-center mb-3">
        <View className="text-center">
          <FlipDigit value={Math.floor(days / 10)} color={primaryColor} />
          <FlipDigit value={days % 10} color={primaryColor} />
          <Text className="block text-xs text-gray-500 mt-1">天</Text>
        </View>
      </View>

      {/* Hours : Minutes : Seconds */}
      <View className="flex items-center justify-center gap-2">
        <TimeUnit value={hours} label="时" color={primaryColor} />
        <Text className="text-xl font-bold" style={{ color: primaryColor }}>:</Text>
        <TimeUnit value={minutes} label="分" color={primaryColor} />
        <Text className="text-xl font-bold" style={{ color: primaryColor }}>:</Text>
        <TimeUnit value={seconds} label="秒" color={primaryColor} />
      </View>
    </View>
  )
}

function FlipDigit({ value, color }: { value: number; color: string }) {
  return (
    <View 
      className="flip-card-single"
      style={{ backgroundColor: color }}
    >
      <Text className="text-3xl font-bold text-white">{value}</Text>
    </View>
  )
}

function TimeUnit({ value, label, color }: { value: number; label: string; color: string }) {
  const str = value.toString().padStart(2, '0')
  return (
    <View className="text-center">
      <View className="flex gap-0.5">
        {str.split('').map((d, i) => (
          <View 
            key={i}
            className="w-6 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <Text className="text-base font-bold text-white">{d}</Text>
          </View>
        ))}
      </View>
      <Text className="block text-xs text-gray-500 mt-1">{label}</Text>
    </View>
  )
}
