// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoROrder:function (e) {//前往全部订单
    console.log(e);
    var index = e.currentTarget.dataset.index
    wx.navigateTo( {
      url:'/pages/orderAll/orderAll?index='+ index
    })
  },
  callPhone:function () {//拨打客服电话
    wx.makePhoneCall({
      phoneNumber:'4000286889',
      success:function(res){
        console.log(res)
      }
    })
  },
  goOrder:function(e) {//前往单个页面
  console.log(e);
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/orderAll/orderAll?index=' + index
    })
  },
  lazyRed:function() {//前往懒猪红包
      wx.navigateTo({
      url: '/pages/lazyRed/lazyRed',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  ReCord:function() {//前往钱包
      wx.navigateTo({
        url: '/pages/Record/Record',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  gotoSet:function() {//前往设置界面
    wx.navigateTo({
      url: '/pages/setAplet/setAplet',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  uploadImg:function() {
    var obj = {
      userid:4,
      merchantid:2,
      socre:4.5,
      comment:"很好,很棒棒",
      id: 1041
    }
    // wx.chooseImage({
    //   count:3,
    //   sizeType:['original','compressed'],//默认是原图还是压缩图
    //   sourceType:['album','camera'],//相机和相册一起
    //   success: function(res) {
    //     console.log(res);
    //     var tempFilePaths= res.tempFilePaths;
    //     wx.uploadFile({
    //       url: 'http://39.108.113.149:8081/merchant/updateByMerchantAndStore',
    //       filePath: tempFilePaths[0],
    //       name: 'img',
    //       method:'Post',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错  
    //       },
    //       data: {
    //         id: 2
    //       },
    //       success:function(res) {
    //         console.log(res)
    //       },
    //       fail:function(err) {
    //         console.log(err)
    //       }
    //     })
    //   },
    // })
    wx.navigateTo({
      url: '/pages/map/map',
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