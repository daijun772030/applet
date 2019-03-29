// pages/refundMsg/refundMsg.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,//退款订单的id
    refundObj:null,//退款订单详情
    type:null,//退款订单的状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  query:function() {//查询退款订单的详情
    var that = this;
    var id = that.data.id
    service.request('orderDitail',{orderid:id}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200&&res.data.data) {
        that.setData({
          refundObj:res.data.data
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(options);
    var type = parseInt(options.type);
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
    this.query();
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