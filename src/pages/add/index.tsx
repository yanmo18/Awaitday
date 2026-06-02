import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { ArrowLeft } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useCountdownStore } from '@/store/countdown'

export default function AddPage() {
  const { addCountdown } = useCountdownStore()
  const [name, setName] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTheme, setSelectedTheme] = useState('default')

  const themes = [
    { id: 'default', name: '晨光白', color: '#6366F1' },
    { id: 'birthday', name: '蜜橙暖阳', color: '#F97316' },
    { id: 'travel', name: '天际蓝', color: '#3B82F6' },
    { id: 'festival', name: '喜庆红', color: '#EF4444' }
  ]

  const handleSave = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入倒计时名称', icon: 'none' })
      return
    }
    if (!selectedDate) {
      Taro.showToast({ title: '请选择日期', icon: 'none' })
      return
    }

    addCountdown({
      name: name.trim(),
      targetDate: selectedDate.toISOString(),
      theme: selectedTheme
    })

    Taro.showToast({ title: '添加成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }

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

        {/* Date Picker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">目标日期</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
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
              {themes.map((theme) => (
                <View
                  key={theme.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedTheme === theme.id 
                      ? 'border-primary bg-primary bg-opacity-10' 
                      : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <View 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.color }}
                  />
                  <Text className="block text-sm">{theme.name}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          className="w-full py-6 text-lg font-medium"
          onClick={handleSave}
        >
          <Text className="text-white font-medium">保存倒计时</Text>
        </Button>
      </View>
    </View>
  )
}
