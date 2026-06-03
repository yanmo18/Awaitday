import { View, Text } from '@tarojs/components'

interface GradientStyleProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  primaryColor: string
  secondaryColor: string
  name: string
  targetDate: string
}

export function GradientStyle({ 
  days, hours, minutes, seconds, primaryColor, secondaryColor, name, targetDate 
}: GradientStyleProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const strHours = hours.toString().padStart(2, '0')
  const strMinutes = minutes.toString().padStart(2, '0')
  const strSeconds = seconds.toString().padStart(2, '0')

  return (
    <View 
      className="p-5 rounded-2xl overflow-hidden relative"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
      }}
    >
      {/* Header */}
      <View className="flex items-center justify-between mb-3">
        <Text className="text-lg font-bold text-white">{name}</Text>
        <Text className="text-sm text-white opacity-80">{formatDate(targetDate)}</Text>
      </View>

      {/* Days - Hero */}
      <View className="flex items-center justify-center py-4 mb-3">
        <View 
          className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Text className="text-5xl font-bold text-white">{days}</Text>
          <Text className="text-sm text-white opacity-80">天</Text>
        </View>
      </View>

      {/* Time */}
      <View className="flex items-center justify-center gap-3">
        <GradientDigit digits={strHours} label="时" />
        <Text className="text-2xl text-white">:</Text>
        <GradientDigit digits={strMinutes} label="分" />
        <Text className="text-2xl text-white">:</Text>
        <GradientDigit digits={strSeconds} label="秒" />
      </View>
    </View>
  )
}

function GradientDigit({ digits, label }: { digits: string; label: string }) {
  return (
    <View className="text-center">
      <View className="flex gap-1">
        {digits.split('').map((d, i) => (
          <View 
            key={i}
            className="w-7 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <Text className="text-lg font-bold text-white">{d}</Text>
          </View>
        ))}
      </View>
      <Text className="block text-xs text-white opacity-70 mt-1">{label}</Text>
    </View>
  )
}
