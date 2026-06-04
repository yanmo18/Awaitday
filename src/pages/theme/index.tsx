import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

export default function StylePage() {
  const [currentStyle, setCurrentStyle] = useState('ring')

  const styles = [
    { id: 'ring', name: '圆环进度', description: '优雅的圆环进度条，中心显示天数' },
    { id: 'flip', name: '翻牌动画', description: '经典翻页时钟效果，数字翻转动画' },
    { id: 'gradient', name: '渐变卡片', description: '渐变背景大数字，视觉冲击力强' },
    { id: 'minimal', name: '极简风格', description: '简洁数字展示，干净利落' }
  ]

  useEffect(() => {
    const saved = Taro.getStorageSync('countdown_style')
    if (saved) setCurrentStyle(saved)
  }, [])

  const handleSelectStyle = (styleId: string) => {
    setCurrentStyle(styleId)
    Taro.setStorageSync('countdown_style', styleId)
    Taro.showToast({ title: '样式已应用', icon: 'success' })
  }

  // 预览组件
  const PreviewRing = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
      <View style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ringGrad)" strokeWidth="8" strokeDasharray="198" strokeLinecap="round" />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366F1' }}>07</Text>
        </View>
      </View>
    </View>
  )

  const PreviewFlip = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '4px' }}>
      {['0', '7'].map((digit, i) => (
        <View
          key={i}
          style={{
            width: '28px',
            height: '40px',
            backgroundColor: '#1E293B',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#F8FAFC' }}>{digit}</Text>
        </View>
      ))}
      <Text style={{ fontSize: '20px', color: '#64748B', margin: '0 2px' }}>天</Text>
    </View>
  )

  const PreviewGradient = () => (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '120px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        borderRadius: '16px',
        margin: '8px'
      }}
    >
      <Text style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFFFFF' }}>07</Text>
      <Text style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginLeft: '8px' }}>天</Text>
    </View>
  )

  const PreviewMinimal = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
      <Text style={{ fontSize: '56px', fontWeight: '200', color: '#1E293B', letterSpacing: '-2px' }}>07</Text>
      <Text style={{ fontSize: '14px', color: '#64748B', marginLeft: '8px', fontWeight: '500' }}>天</Text>
    </View>
  )

  const renderPreview = (styleId: string) => {
    switch (styleId) {
      case 'ring': return <PreviewRing />
      case 'flip': return <PreviewFlip />
      case 'gradient': return <PreviewGradient />
      case 'minimal': return <PreviewMinimal />
      default: return <PreviewRing />
    }
  }

  return (
    <View className="min-h-screen bg-slate-50 p-4">
      <Text className="block text-lg font-semibold text-slate-800 mb-4">选择倒计时样式</Text>
      
      {styles.map((style) => (
        <Card
          key={style.id}
          className={`mb-4 overflow-hidden ${currentStyle === style.id ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => handleSelectStyle(style.id)}
        >
          <CardContent className="p-0">
            {/* 预览区域 */}
            <View className="bg-white">
              {renderPreview(style.id)}
            </View>
            {/* 信息区域 */}
            <View className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
              <View>
                <Text className="block text-base font-medium text-slate-800">{style.name}</Text>
                <Text className="block text-sm text-slate-500 mt-1">{style.description}</Text>
              </View>
              {currentStyle === style.id && (
                <View className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          </CardContent>
        </Card>
      ))}

      <View className="mt-6 p-4 bg-indigo-50 rounded-xl">
        <Text className="block text-sm text-indigo-600 font-medium mb-2">提示</Text>
        <Text className="block text-sm text-slate-600">选择样式后，所有倒计时都会使用该样式展示。颜色可在添加倒计时时自定义。</Text>
      </View>
    </View>
  )
}
