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
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <View className="progress-ring-container" style={{ width: size, height: size }}>
      {/* 使用 View + CSS conic-gradient 实现圆环（小程序不支持SVG） */}
      <View className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* 背景圆环 */}
        <View 
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#E5E7EB',
          }}
        />
        {/* 进度圆环 - 使用 conic-gradient */}
        <View 
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            background: `conic-gradient(from -90deg, ${primaryColor} 0%, ${secondaryColor} ${animatedProgress * 100}%, transparent ${animatedProgress * 100}%, transparent 100%)`,
            transition: 'background 1s ease-out',
          }}
        />
        {/* 内部白色圆 */}
        <View 
          style={{
            position: 'absolute',
            width: size - strokeWidth * 2,
            height: size - strokeWidth * 2,
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor: '#FFFFFF',
          }}
        />
      </View>
    </View>
  )
}