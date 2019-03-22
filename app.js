//app.js
App({
  globalData: {
    userData:null,
    commercial:null,
    shopCarList:null,//购物车点击结算购物车订单
    shopUpId:[],//提交购物车的购物车的id集合
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // wx.getLocation({
    //   type:'gcj02',
    //   success: function(res) {
    //     console.log(res);
    //     const latitude = res.latitude;
    //     const longitude = res.longitude;
    //     wx.openLocation({
    //       latitude:latitude,
    //       longitude: longitude,
    //       success:function(res) {
    //         console.log(res);
    //       }
    //     })
    //   },
    // }),
    
  },
  onShow () {//小程序启动或者从后台进入到前台
  
  },
  onHide () {//小程序从前台进入到后台

  },
  onError(mes) {//脚本发生错误时候
    console.log(mes);
  },
  globalData: {
    userInfo: null
  }
})