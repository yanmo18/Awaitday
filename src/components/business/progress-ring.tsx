import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  primaryColor?: string
  secondaryColor?: string
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 6,
  primaryColor = '#6366F1',
  secondaryColor = '#8B5CF6'
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  useEffect(() => {
    // 进度动画
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const progressDeg = animatedProgress * 360
  const innerSize = size - strokeWidth * 2

  return (
    <View className="progress-ring-container relative" style={{ width: size, height: size }}>
      {/* 背景圆环 */}
      <View 
        className="absolute inset-0 rounded-full"
        style={{ 
          borderWidth: strokeWidth,
          borderStyle: 'solid',
          borderColor: '#E5E7EB'
        }}
      />
      
      {/* 进度圆环 - 使用 conic-gradient */}
      <View 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <View 
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor} ${progressDeg}deg, transparent ${progressDeg}deg)`
          }}
        >
          <View 
            className="absolute rounded-full"
            style={{ 
              width: innerSize,
              height: innerSize,
              top: strokeWidth,
              left: strokeWidth,
              backgroundColor: '#fff'
            }}
          />
        </View>
      </View>
    </View>
  )
}
