import { View, Text } from '@tarojs/components'

interface ProgressRingProps {
  progress?: number // 0-1
  size?: number
  strokeWidth?: number
  color?: string
  days?: number
}

export function ProgressRing({
  progress = 0.7,
  size = 120,
  strokeWidth = 8,
  color = '#6366F1',
  days = 0
}: ProgressRingProps) {
  const innerSize = size - strokeWidth * 2
  const rotation = progress * 360 - 90

  return (
    <View className="flex items-center justify-center">
      <View className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* 背景圆环 */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#E5E7EB'
          }}
        />
        {/* 彩色圆环边框 */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderStyle: 'solid',
            borderTopColor: color,
            borderRightColor: progress > 0.25 ? color : 'transparent',
            borderBottomColor: progress > 0.5 ? color : 'transparent',
            borderLeftColor: progress > 0.75 ? color : 'transparent',
            transform: `rotate(${rotation}deg)`
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
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <Text style={{ fontSize: '32px', fontWeight: 'bold', color }}>{days}</Text>
        </View>
      </View>
    </View>
  )
}
