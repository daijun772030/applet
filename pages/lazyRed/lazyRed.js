// pages/order/order.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderLlist: [
      { name: '未使用', value: 1 },
      { name: '已过期', value: 2 },
      { name: '已使用', value: 3 }
    ],
    navbarActiveIndex: 0,//导航和下面商品的联动
    duration: 100,//滑动时常
    circular: true,//是否衔接动画
    second_height: null,//滑动得高度
    redArr:null,//红包的数组
    phone:null,//用户手机号
  },

  onNavBarTap(e) {//页面上部导航条的点击跳转
  console.log(e);
    var that = this;
    let navBarIndex = e.currentTarget.dataset.navbarIndex;
    this.setData({
      navbarActiveIndex: navBarIndex
    })
    that.queryRed(navBarIndex)
  },
  onBindAnimationFinish(detail) {//导航下部内容滑动
    console.log(detail)
    this.setData({
      navbarActiveIndex: detail.detail.current
    })
    var value = this.data.navbarActiveIndex
    this.queryRed(value)
  },
  queryRed:function (value) {//查询红包
    console.log(app.globalData)
    var id = app.globalData.userData.id;
    var phone = app.globalData.userData.phone;
    service.request('queryRed', { userid: id, status: value}).then((res)=>{
      console.log(res);
      this.setData({
        redArr:res.data.data,
        phone:phone
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var index = that.data.navbarActiveIndex;
    this.queryRed(0)
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - res.windowWidth / 750 * 132
        })
      }
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