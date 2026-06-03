import { View, Text } from '@tarojs/components'

interface MinimalStyleProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  primaryColor: string
  name: string
  targetDate: string
}

export function MinimalStyle({ 
  days, hours, minutes, seconds, primaryColor, name, targetDate 
}: MinimalStyleProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <View className="p-5 rounded-2xl bg-white border" style={{ borderColor: primaryColor + '30' }}>
      {/* Header */}
      <View className="flex items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-800">{name}</Text>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: primaryColor + '15' }}
        >
          <Text className="text-xs" style={{ color: primaryColor }}>{formatDate(targetDate)}</Text>
        </View>
      </View>

      {/* Big Number */}
      <View className="flex items-end justify-center mb-4">
        <Text 
          className="font-bold"
          style={{ 
            fontSize: '80px',
            color: primaryColor,
            lineHeight: 1
          }}
        >
          {days}
        </Text>
        <Text 
          className="text-2xl font-medium mb-3 ml-2"
          style={{ color: primaryColor }}
        >
          天
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mb-3" />

      {/* Time */}
      <View className="flex items-center justify-center gap-4">
        <MinimalTimeBlock value={hours} label="时" color={primaryColor} />
        <Text className="text-gray-300 text-lg">|</Text>
        <MinimalTimeBlock value={minutes} label="分" color={primaryColor} />
        <Text className="text-gray-300 text-lg">|</Text>
        <MinimalTimeBlock value={seconds} label="秒" color={primaryColor} />
      </View>
    </View>
  )
}

function MinimalTimeBlock({ value, label, color }: { value: number; label: string; color: string }) {
  const str = value.toString().padStart(2, '0')
  return (
    <View className="text-center">
      <Text className="text-xl font-medium" style={{ color }}>{str}</Text>
      <Text className="block text-xs text-gray-400 mt-1">{label}</Text>
    </View>
  )
}
