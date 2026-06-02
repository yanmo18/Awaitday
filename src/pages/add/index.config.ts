export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '添加倒计时'
    })
  : {
      navigationBarTitleText: '添加倒计时'
    }
