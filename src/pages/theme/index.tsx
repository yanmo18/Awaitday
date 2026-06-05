import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

export default function StylePage() {
  const [currentStyle, setCurrentStyle] = useState('ring')
  const [swiperCurrent, setSwiperCurrent] = useState(0)

  const styles = [
    { id: 'ring', name: '圆环进度', description: '优雅的圆环进度条，中心显示天数' },
    { id: 'flip', name: '翻牌动画', description: '经典翻页时钟效果，数字翻转动画' },
    { id: 'gradient', name: '渐变卡片', description: '渐变背景大数字，视觉冲击力强' },
    { id: 'minimal', name: '极简风格', description: '简洁数字展示，干净利落' }
  ]

  useEffect(() => {
    const saved = Taro.getStorageSync('countdown_style')
    if (saved) {
      setCurrentStyle(saved)
      const index = styles.findIndex(s => s.id === saved)
      if (index >= 0) setSwiperCurrent(index)
    }
  }, [])

  const handleSelectStyle = (styleId: string) => {
    setCurrentStyle(styleId)
    Taro.setStorageSync('countdown_style', styleId)
    Taro.showToast({ title: '样式已应用', icon: 'success' })
  }

  const handleSwiperChange = (e: { detail: { current: number } }) => {
    setSwiperCurrent(e.detail.current)
  }

  // 预览组件 - 使用 View + CSS 实现圆环（小程序不支持 SVG）
  const PreviewRing = () => {
    const size = 100
    const strokeWidth = 8
    const progress = 0.7 // 70% 进度
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
        <View style={{ position: 'relative', width: size, height: size }}>
          {/* 背景圆环 */}
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#E2E8F0',
            }}
          />
          {/* 进度圆环 */}
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              background: `conic-gradient(from -90deg, #6366F1 0%, #8B5CF6 ${progress * 100}%, transparent ${progress * 100}%, transparent 100%)`,
            }}
          />
          {/* 内部白色圆 */}
          <View
            style={{
              position: 'absolute',
              left: strokeWidth,
              top: strokeWidth,
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366F1' }}>07</Text>
          </View>
        </View>
      </View>
    )
  }

  const PreviewFlip = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', gap: '6px' }}>
      {['0', '7'].map((digit, i) => (
        <View
          key={i}
          style={{
            width: '36px',
            height: '50px',
            backgroundColor: '#1E293B',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Text style={{ fontSize: '26px', fontWeight: 'bold', color: '#F8FAFC' }}>{digit}</Text>
        </View>
      ))}
      <Text style={{ fontSize: '22px', color: '#64748B', marginLeft: '4px' }}>天</Text>
    </View>
  )

  const PreviewGradient = () => (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '140px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        borderRadius: '16px',
        margin: '8px'
      }}
    >
      <Text style={{ fontSize: '56px', fontWeight: 'bold', color: '#FFFFFF' }}>07</Text>
      <Text style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginLeft: '8px' }}>天</Text>
    </View>
  )

  const PreviewMinimal = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
      <Text style={{ fontSize: '64px', fontWeight: '200', color: '#1E293B', letterSpacing: '-2px' }}>07</Text>
      <Text style={{ fontSize: '16px', color: '#64748B', marginLeft: '8px', fontWeight: '500' }}>天</Text>
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
      
      {/* 使用 Swiper 原生组件实现样式左右滑动切换 */}
      <View className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
        <Swiper
          className="h-44"
          indicatorDots={false}
          autoplay={false}
          current={swiperCurrent}
          onChange={handleSwiperChange}
        >
          {styles.map((style) => (
            <SwiperItem key={style.id}>
              <View className="h-full bg-white">
                {renderPreview(style.id)}
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        
        {/* 导航指示器 */}
        <View className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <View 
            className="p-1"
            onClick={() => {
              const newIndex = swiperCurrent > 0 ? swiperCurrent - 1 : styles.length - 1
              setSwiperCurrent(newIndex)
            }}
          >
            <ChevronLeft size={20} color="#64748B" />
          </View>
          
          <View className="flex items-center gap-2">
            {styles.map((style, index) => (
              <View
                key={style.id}
                className={`h-2 rounded-full transition-all ${index === swiperCurrent ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </View>
          
          <View 
            className="p-1"
            onClick={() => {
              const newIndex = swiperCurrent < styles.length - 1 ? swiperCurrent + 1 : 0
              setSwiperCurrent(newIndex)
            }}
          >
            <ChevronRight size={20} color="#64748B" />
          </View>
        </View>
      </View>

      {/* 当前样式信息 */}
      <Card className={`mb-4 overflow-hidden ${currentStyle === styles[swiperCurrent].id ? 'ring-2 ring-indigo-500' : ''}`}>
        <CardContent className="p-4">
          <View className="flex items-center justify-between">
            <View>
              <Text className="block text-base font-medium text-slate-800">{styles[swiperCurrent].name}</Text>
              <Text className="block text-sm text-slate-500 mt-1">{styles[swiperCurrent].description}</Text>
            </View>
            {currentStyle === styles[swiperCurrent].id && (
              <View className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      {/* 应用按钮 */}
      <View 
        className="bg-indigo-500 rounded-xl py-4 flex items-center justify-center active:bg-indigo-600"
        onClick={() => handleSelectStyle(styles[swiperCurrent].id)}
      >
        <Text className="text-white font-medium">应用此样式</Text>
      </View>

      <View className="mt-6 p-4 bg-indigo-50 rounded-xl">
        <Text className="block text-sm text-indigo-600 font-medium mb-2">提示</Text>
        <Text className="block text-sm text-slate-600">左右滑动预览不同样式，点击「应用此样式」保存设置。颜色可在添加倒计时时自定义。</Text>
      </View>
    </View>
  )
}
