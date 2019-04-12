//app.js
const service = require('./utils/myapi.js')
App({
  globalData: {
    userData:null,
    commercial:null,
    shopCarList:null,//购物车点击结算购物车订单
    shopUpId:[],//提交购物车的购物车的id集合
    shopMsg:null,//订单的详情
    addressList:null,//编辑地址的集合,
    appid: 'wxe562417cc49d20bc',//小程序appid
    secret: '8d803622d8ad580a0bb4eaa21b8aade7',
    gradeList:null,//评价需要的对象数据
    phone:null,//登录的账号
  },
  onLaunch: function () {
    var that =this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        var appid = that.globalData.appid;
        var secret = that.globalData.secret;
        console.log(appid,secret);
        service.request('getOppend',{js_code:res.code}).then((res)=>{
          console.log(res.data.data);
          var newID = res.data.data.split(':');
          var newId = newID[2].split('"')
          console.log(newId);
          wx.setStorage({
              key: 'oppenid',
              data: newId[1],
              success: function () { 
                console.log('保存成功得oppenid:' + newId[1]);
              }
            },
            )
        })
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