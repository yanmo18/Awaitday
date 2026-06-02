import { View, Text } from '@tarojs/components'
import { useEffect, useState, useRef } from 'react'
import './flip-card.css'

interface FlipCardProps {
  value: number
  themeColor?: string
}

export function FlipCard({ value, themeColor = '#6366F1' }: FlipCardProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isFlipping, setIsFlipping] = useState(false)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsFlipping(true)
      const timer = setTimeout(() => {
        setDisplayValue(value)
        setIsFlipping(false)
      }, 300)
      prevValueRef.current = value
      return () => clearTimeout(timer)
    }
  }, [value])

  const displayStr = displayValue.toString().padStart(2, '0')
  const prevStr = prevValueRef.current.toString().padStart(2, '0')

  return (
    <View className="flip-card-container">
      {displayStr.split('').map((digit, index) => {
        const prevDigit = prevStr[index]
        const shouldFlip = prevDigit !== digit && isFlipping
        
        return (
          <View key={index} className="flip-card">
            {/* 上半部分 */}
            <View className="flip-card-top">
              <View className="flip-card-inner">
                <Text className="flip-card-text" style={{ color: '#fff' }}>
                  {digit}
                </Text>
              </View>
            </View>
            
            {/* 下半部分 */}
            <View className="flip-card-bottom">
              <View className="flip-card-inner">
                <Text className="flip-card-text" style={{ color: '#fff' }}>
                  {digit}
                </Text>
              </View>
            </View>

            {/* 翻转动画层 */}
            {shouldFlip && (
              <>
                <View 
                  className="flip-card-flip-top"
                  style={{ backgroundColor: themeColor }}
                >
                  <View className="flip-card-inner">
                    <Text className="flip-card-text" style={{ color: '#fff' }}>
                      {prevDigit}
                    </Text>
                  </View>
                </View>
                <View 
                  className="flip-card-flip-bottom"
                  style={{ backgroundColor: themeColor }}
                >
                  <View className="flip-card-inner">
                    <Text className="flip-card-text" style={{ color: '#fff' }}>
                      {digit}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* 中线 */}
            <View className="flip-card-divider" />
          </View>
        )
      })}
    </View>
  )
}
