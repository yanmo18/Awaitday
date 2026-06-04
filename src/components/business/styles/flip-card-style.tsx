import { View, Text } from '@tarojs/components'

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

  const daysStr = days.toString().padStart(2, '0')

  return (
    <View className="p-4 rounded-2xl" style={{ backgroundColor: '#F8FAFC' }}>
      {/* 标题行 */}
      <View className="flex items-center justify-between mb-4">
        <View>
          <Text className="block text-lg font-bold text-slate-800">{name}</Text>
          <Text className="block text-xs text-gray-500 mt-1">{formatDate(targetDate)}</Text>
        </View>
      </View>

      {/* 主体：数字 + "天"字 */}
      <View 
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {/* 数字组 */}
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
          {daysStr.split('').map((digit, index) => (
            <View
              key={index}
              style={{
                width: '48px',
                height: '56px',
                borderRadius: '10px',
                backgroundColor: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFFFFF' }}>{digit}</Text>
            </View>
          ))}
        </View>
        
        {/* "天"字 - 无色块 */}
        <Text style={{ fontSize: '20px', fontWeight: '600', color: '#64748B' }}>天</Text>
      </View>

      {/* 底部：时分秒 */}
      <View 
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #E2E8F0'
        }}
      >
        <TimeUnit value={hours} label="时" color={primaryColor} />
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor }}>:</Text>
        <TimeUnit value={minutes} label="分" color={primaryColor} />
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor }}>:</Text>
        <TimeUnit value={seconds} label="秒" color={primaryColor} />
      </View>
    </View>
  )
}

function TimeUnit({ value, label, color }: { value: number; label: string; color: string }) {
  const str = value.toString().padStart(2, '0')
  return (
    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
        {str.split('').map((d, i) => (
          <View 
            key={i}
            style={{
              width: '20px',
              height: '28px',
              borderRadius: '4px',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' }}>{d}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>{label}</Text>
    </View>
  )
}
