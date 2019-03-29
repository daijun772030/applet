// pages/address/address.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:null,//用户id
    addressList:null,//地址集合
  },
  qeryDistance: function () {//查询用户的所有地址
    var that = this;
    service.request('allDistance', { userid: that.data.userid }).then((res) => {
      console.log(res);
      that.setData({
        addressList:res.data.data
      })
    })
  },
  goUpAdd:function(e) {
    wx.navigateTo({
      url: '/pages/upAddress/upAddress'
    })
    app.globalData.addressList = e.currentTarget.dataset.item
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = app.globalData.userData.id
    that.setData({
      userid: id,
    });
    that.qeryDistance();
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