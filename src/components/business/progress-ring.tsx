import { View } from '@tarojs/components'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  primaryColor?: string
  secondaryColor?: string
}

export function ProgressRing({
  size = 100,
  strokeWidth = 6,
  primaryColor = '#6366F1',
}: ProgressRingProps) {
  const innerSize = size - strokeWidth * 2

  return (
    <View className="progress-ring-container" style={{ width: size, height: size }}>
      <View className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* 背景圆环 */}
        <View style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#E5E7EB'
        }} />
        {/* 彩色圆环边框 */}
        <View style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderStyle: 'solid',
          borderColor: primaryColor
        }} />
        {/* 内部白色圆 */}
        <View style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: '#FFFFFF'
        }} />
      </View>
    </View>
  )
}
