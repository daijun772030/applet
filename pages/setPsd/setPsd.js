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
    password:'',//第一次设置密码
    againPsd:'',//再次设置密码
    Invitation:null,//邀请码
  },
  upPasswode: function (e) {//获取第一次输入的密码
    console.log(e.detail.value)
    this.setData({
      password: e.detail.value
    })
  },
  chedInput:function(e) {//键盘收起时
    console.log(e);
    if (this.data.password == e.detail.value) {
      console.log('两次密码相等')
      this.setData({
        againPsd: e.detail.value
      })
    } else {
      console.log('两次密码不相等')
      wx.showToast({
        title: '两次密码不相符，重新输入',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
      this.setData({
        againPsd:''
      })
    }
  },
  Invitation:function(e) {//获取邀请码
    console.log(e.detail.value)
    this.setData({
      Invitation:e.detail.value
    })
  },
  login:function() {
    var that = this;
    var psd = that.data.password;
    var againPsd = that.data.againPsd;
    var phone = app.globalData.phone;
    var Invitation = that.data.Invitation;
    if(psd&&againPsd&&(psd==againPsd)) {
      var pws = MD5.hexMD5(againPsd);
    }
    if(Invitation) {
      serverce.request("setPsd", { phone: phone, password: pws, code: Invitation }).then((res) => {
        console.log(res);
        if (res.data.retCode == 200) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          that.setData({
            password: '',
            againPsd: '',
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      })
    }else{
      serverce.request("setPsd", { phone: phone, password: pws}).then((res) => {
        console.log(res);
        if (res.data.retCode == 200) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          that.setData({
            password: '',
            againPsd: '',
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      })
    }
    
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