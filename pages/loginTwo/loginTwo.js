// pages/personal/personal.js
const app = getApp();
const serverce = require('../../utils/myapi.js')
var interval = null;
const MD5 = require('../../utils/MD5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordType: true,//是否为密码输入
    disabled: false,//验证码按钮是否使用
    item: '获取验证码',//倒计时
    currentTime: 61,
    phone:'',//电话号码
    psd:'',//验证码
    boolean:true,
    type:true,//默认阅读懒猪协议
  },

  //页面点击事件函数
  // getCode: function () {
  //   // debugger;
  //   var that = this;
  //   var cureTime = that.data.currentTime;
  //   interval = setInterval(function () {
  //     cureTime--;
  //     that.setData({
  //       item: cureTime + 's'
  //     })
  //     if (cureTime <= 0) {
  //       clearInterval(interval)
  //       that.setData({
  //         item: '重新发送',
  //         currentTime: 61,
  //         disabled: false
  //       })
  //     }
  //   }, 1000)
  // },
  userNameInput: function (e) {//获取手机号
    this.setData({
      phone: e.detail.value
    })
  },
  passWdInput: function (e) {//获取输入的密码

    this.setData({
      psd: e.detail.value
    })
  },
  success: function (code) {//状态成功后的弹窗
    if (code.data.retCode == 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
    } else {
      wx.showToast({
        title: '登陆失败',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
    }
  },

  login: function () {//验证码登录
    const that = this;
    var pwd = that.data.psd
    var phone = that.data.phone
    if(pwd&&phone) {
      var pws = MD5.hexMD5(pwd);
      console.log(pws);
      console.log(that.data.phone, that.data.psd)
      var type = that.data.type;
      if (type) {
        serverce.request('loginPwd', { phone: phone, password: pws }).then((res) => {
          console.log(res);
          app.globalData.userData = res.data.data;
          if (res.data.retCode == 200) {
            that.success(res)
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else {
            that.success(res)
            wx.showToast({
              title: '登陆失败',
              icon: 'none',
              duration: 1500,
              mask: true,
            })
          }
          console.log(app.globalData.userData)
        })
      } else {
        wx.showToast({
          title: '请勾选您已阅读懒猪协议',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      }
    }else {
      wx.showToast({
        title: '填写账号和密码',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
  },
  webview: function () {//跳转懒猪到家协议
    wx.navigateTo({
      url: '/pages/webview/lazyweb',
    })
  },
  gonathLogin: function () {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  bechi:function(e) {
    console.log(e);
    var type = this.data.type;
    this.setData({
      type:(!type)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})