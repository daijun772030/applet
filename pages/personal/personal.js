// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoROrder:function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index
    wx.navigateTo( {
      url:'/pages/orderAll/orderAll?index='+ index
    })
  },
  callPhone:function () {
    wx.makePhoneCall({
      phoneNumber:'4000286889',
      success:function(res){
        console.log(res)
      }
    })
  },
  goOrder:function() {
    wx.navigateTo({
      url: '/pages/complete/complete'
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