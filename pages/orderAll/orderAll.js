// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderLlist: [
      { name: '全部', value: 1 },
      { name: '待付款', value: 2 },
      { name: '待接单', value: 3 },
      {name:'待取货',value:4},
      { name: '待发货', value: 5 },
      { name: '待收货', value: 6 },
      { name: '待评价', value: 7 }
    ],
    navbarActiveIndex: 0,//导航和下面商品的联动
    duration: 100,//滑动时常
    circular: true,//是否衔接动画
    second_height: null,//滑动得高度
  },

  onNavBarTap(e) {//页面上部导航条的点击跳转
    var that = that;
    let navBarIndex = e.currentTarget.dataset.navbarIndex;
    this.setData({
      navbarActiveIndex: navBarIndex
    })
  },
  onBindAnimationFinish(detail) {//导航下部内容滑动
    console.log(detail)
    this.setData({
      navbarActiveIndex: detail.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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