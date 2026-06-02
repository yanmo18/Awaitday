export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/add/index',
    'pages/theme/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '倒计时',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#6366F1',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '倒计时',
        iconPath: './assets/tabbar/clock.png',
        selectedIconPath: './assets/tabbar/clock-active.png'
      },
      {
        pagePath: 'pages/add/index',
        text: '添加',
        iconPath: './assets/tabbar/circle-plus.png',
        selectedIconPath: './assets/tabbar/circle-plus-active.png'
      },
      {
        pagePath: 'pages/theme/index',
        text: '主题',
        iconPath: './assets/tabbar/palette.png',
        selectedIconPath: './assets/tabbar/palette-active.png'
      }
    ]
  }
})
