// pages/complete/complete.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,//订单id
    type:null,//订单状态
    refundObj:null,//订单详情对象
    refundTwo:null,//订单其他的详情
  },
  queryOrder:function() {
    console.log(app.globalData.shopMsg)
    var list = app.globalData.shopMsg;
    var that = this;
    var id = that.data.id
    service.request('orderDitail', { orderid: id }).then((res) => {
      console.log(res);
      if (res.data.retCode == 200 && res.data.data) {
        that.setData({
          refundObj: res.data.data
        })
      }
    })
    that.setData({
      refundTwo: list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      type:options.type
    })
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
    this.queryOrder();
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