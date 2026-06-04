import { View, Text, Picker } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { ArrowLeft, Palette } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'

interface ThemeOption {
  id: string
  name: string
  primary: string
  secondary: string
  bg: string
  isCustom?: boolean
}

export default function AddPage() {
  const [name, setName] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [pickerDate, setPickerDate] = useState<string>(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [showPicker, setShowPicker] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [customPrimary, setCustomPrimary] = useState('#6366F1')
  const [customSecondary, setCustomSecondary] = useState('#8B5CF6')

  const presetThemes: ThemeOption[] = [
    { id: 'default', name: '晨光白', primary: '#6366F1', secondary: '#8B5CF6', bg: '#F8FAFC' },
    { id: 'birthday', name: '蜜橙暖阳', primary: '#F97316', secondary: '#FB923C', bg: '#FFFBEB' },
    { id: 'travel', name: '天际蓝', primary: '#3B82F6', secondary: '#60A5FA', bg: '#EFF6FF' },
    { id: 'festival', name: '喜庆红', primary: '#EF4444', secondary: '#F87171', bg: '#FEF2F2' }
  ]

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#78716C'
  ]

  const getSelectedThemeData = (): ThemeOption => {
    if (selectedTheme === 'custom') {
      return {
        id: 'custom',
        name: '自定义',
        primary: customPrimary,
        secondary: customSecondary,
        bg: '#F8FAFC',
        isCustom: true
      }
    }
    return presetThemes.find(t => t.id === selectedTheme) || presetThemes[0]
  }

  // Picker 日期变化处理
  const handlePickerChange = (e: { detail: { value: string } }) => {
    const dateStr = e.detail.value
    setPickerDate(dateStr)
    const [year, month, day] = dateStr.split('-').map(Number)
    setSelectedDate(new Date(year, month - 1, day))
  }

  // 同步 Calendar 选择的日期到 Picker
  const handleCalendarSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setPickerDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入倒计时名称', icon: 'none' })
      return
    }
    if (!selectedDate) {
      Taro.showToast({ title: '请选择日期', icon: 'none' })
      return
    }

    const themeData = getSelectedThemeData()
    
    // 存储倒计时数据，包含自定义颜色
    const countdowns = Taro.getStorageSync('countdown_data') || []
    const newCountdown = {
      id: Date.now().toString(),
      name: name.trim(),
      targetDate: selectedDate.toISOString(),
      theme: selectedTheme,
      primaryColor: themeData.primary,
      secondaryColor: themeData.secondary,
      bgColor: themeData.bg,
      createdAt: new Date().toISOString()
    }
    
    Taro.setStorageSync('countdown_data', [...countdowns, newCountdown])
    Taro.showToast({ title: '添加成功', icon: 'success' })
    
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }

  const selectedThemeData = getSelectedThemeData()

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <View className="flex items-center mb-6">
        <View 
          className="p-2 rounded-full bg-white shadow-sm"
          onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
        >
          <ArrowLeft size={20} color="#6366F1" />
        </View>
        <Text className="block text-xl font-semibold ml-4 text-gray-800">添加倒计时</Text>
      </View>

      {/* Form */}
      <View className="space-y-6">
        {/* Name Input */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">倒计时名称</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="例如：生日、放假、出行..."
                value={name}
                onInput={(e) => setName(e.detail.value)}
              />
            </View>
          </CardContent>
        </Card>

        {/* Date Picker - 使用 Picker 原生组件实现快捷日期选择 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">目标日期</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Picker 快捷日期选择 */}
            <View 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3"
              onClick={() => setShowPicker(true)}
            >
              <Text className="text-sm text-gray-600">快捷选择</Text>
              <View className="flex items-center gap-2">
                <Text className="text-base font-medium text-gray-800">{pickerDate}</Text>
                <Text className="text-gray-400">›</Text>
              </View>
            </View>
            {showPicker && (
              <Picker mode="date" value={pickerDate} onChange={handlePickerChange} start="2024-01-01" end="2030-12-31">
                <View className="hidden" />
              </Picker>
            )}
            
            {/* Calendar 详细选择 */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              className="rounded-lg border"
            />
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">选择主题</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex flex-wrap gap-3">
              {presetThemes.map((theme) => (
                <View
                  key={theme.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border-2"
                  style={{
                    borderColor: selectedTheme === theme.id ? theme.primary : '#E5E7EB',
                    backgroundColor: selectedTheme === theme.id ? theme.bg : '#fff'
                  }}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <View 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <Text 
                    className="block text-sm"
                    style={{ color: selectedTheme === theme.id ? theme.primary : '#374151' }}
                  >
                    {theme.name}
                  </Text>
                </View>
              ))}
              
              {/* Custom Theme Button */}
              <View
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2"
                style={{
                  borderColor: selectedTheme === 'custom' ? customPrimary : '#E5E7EB',
                  backgroundColor: selectedTheme === 'custom' ? customPrimary + '15' : '#fff'
                }}
                onClick={() => setSelectedTheme('custom')}
              >
                <Palette size={16} color={selectedTheme === 'custom' ? customPrimary : '#374151'} />
                <Text 
                  className="block text-sm"
                  style={{ color: selectedTheme === 'custom' ? customPrimary : '#374151' }}
                >
                  自定义
                </Text>
              </View>
            </View>

            {/* Color Picker */}
            {selectedTheme === 'custom' && (
              <View className="mt-4 p-4 bg-gray-50 rounded-xl">
                <Text className="block text-sm font-medium text-gray-700 mb-3">主色调</Text>
                <View className="flex flex-wrap gap-2 mb-4">
                  {colors.map((color) => (
                    <View
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${customPrimary === color ? 'border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCustomPrimary(color)}
                    />
                  ))}
                </View>
                
                <Text className="block text-sm font-medium text-gray-700 mb-3">渐变色</Text>
                <View className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <View
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${customSecondary === color ? 'border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCustomSecondary(color)}
                    />
                  ))}
                </View>

                {/* Preview */}
                <View className="mt-4 flex items-center gap-3">
                  <View 
                    className="w-12 h-12 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${customPrimary}, ${customSecondary})` }}
                  />
                  <Text className="block text-sm text-gray-500">预览效果</Text>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card style={{ backgroundColor: selectedThemeData.bg }}>
          <CardContent className="p-4">
            <Text className="block text-sm text-gray-500 mb-3">效果预览</Text>
            <View className="flex items-center gap-4">
              {/* Progress Ring Preview */}
              <svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <linearGradient id="preview-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={selectedThemeData.primary} />
                    <stop offset="100%" stopColor={selectedThemeData.secondary} />
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="26" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="url(#preview-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${0.65 * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="34" textAnchor="middle" fill={selectedThemeData.primary} fontSize="16" fontWeight="bold">
                  07
                </text>
              </svg>
              
              {/* Flip Card Preview */}
              <View className="flex gap-1">
                <View 
                  className="w-10 h-14 rounded-lg flex items-center justify-center shadow-md"
                  style={{ backgroundColor: selectedThemeData.primary }}
                >
                  <Text className="block text-white text-xl font-bold">0</Text>
                </View>
                <View 
                  className="w-10 h-14 rounded-lg flex items-center justify-center shadow-md"
                  style={{ backgroundColor: selectedThemeData.primary }}
                >
                  <Text className="block text-white text-xl font-bold">7</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          className="w-full py-6 text-lg font-medium"
          style={{ backgroundColor: selectedThemeData.primary }}
          onClick={handleSave}
        >
          <Text className="text-white font-medium">保存倒计时</Text>
        </Button>
      </View>
    </View>
  )
}
