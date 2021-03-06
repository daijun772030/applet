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
    passwordType:false,//是否为密码输入
    disabled:false,//验证码按钮是否使用
    item:'获取验证码',//倒计时
    currentTime:61,
    phone:'18382409366',//电话号码
    psd:'lijinhui518818',//验证码
    type:true,//协议默认阅读
  },

    //页面点击事件函数
  getCode:function () {
    // debugger;
    var that = this;
    var cureTime = that.data.currentTime;
    interval = setInterval(function () {
      cureTime--;
      that.setData({
        item:cureTime + 's'
      })
      if(cureTime<=0) {
        clearInterval(interval)
        that.setData({
          item:'重新发送',
          currentTime:61,
          disabled:false
        })
      }
    },1000)
  },
  userNameInput:function (e) {//获取手机号
    this.setData({
      phone:e.detail.value
    })
  },
  passWdInput:function (e) {//获取输入的验证码
    
    this.setData({
      psd: e.detail.value
    })
  },
  success: function (code) {//状态成功后的弹窗
    if (code.data.retCode == 200) {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1500,
        mask: true,
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    }else {
      wx.showToast({
        title: '登录失败',
        icon:'none',
        duration: 1000,
        mask: true,
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
    }
  },
  sendSms:function () {//发送验证码
    const that = this;
    serverce.request('sendSms',{phone:that.data.phone,state:'0'}).then((res)=>{
      console.log(res);
      that.success(res)
    })
  },
  getVerificationCode () {//获取验证码得到验证码
    const that = this;
    that.sendSms();
    that.getCode();
    that.setData({
      disabled:true
    })
  },

  login:function () {//验证码登录
    const that = this;
    var phone = that.data.phone;
    var pwd = that.data.psd
    var type = that.data.type;
    if(type) {
      serverce.request('loginCode', { phone: phone, code: pwd, state: 0 }).then((res) => {
        console.log(res);
        app.globalData.userData = res.data.data;
        if (res.data.retCode == 200) {
          app.globalData.phone = phone;
          if(res.data.data.status ==0 ) {
            that.success(res)
            wx.switchTab({
              url: '/pages/index/index',
            })
          }else {
            console.log('设置密码')
            wx.reLaunch({
              url: '/pages/setPsd/setPsd',
            })
          }
        } else {
          that.success(res)
        }
        console.log(app.globalData.userData)
      })
    }else {
      wx.showToast({
        title: '请勾选您已阅读懒猪协议',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
    
  },
  webview:function () {//跳转懒猪到家协议
    wx.navigateTo({
      url: '/pages/webview/lazyweb',
    })
  },
  gonathLogin:function() {
    wx.reLaunch({
      url: '/pages/loginTwo/loginTwo',
    })
  },
  bechi: function (e) {
    console.log(e);
    var type = this.data.type;
    this.setData({
      type: (!type)
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