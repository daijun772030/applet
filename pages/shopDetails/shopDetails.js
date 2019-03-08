// pages/shopDetails/shopDetails.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据e
   */
  data: {
    userid:null,//用户id
    shopid:null,//商户id
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 500, //可以控制动画
    list: '',
    one_1:5,
    two_1:0,
    second_height:0,
    detail: [],//商品数组
    navbarActiveIndex:0,//导航和下面商品的联动
    navbarTitle:[//导航名称
      "下单",
      "评价",
      "商家"
    ]
  },
  onNavBarTap(e) {//页面上部导航条的点击跳转
    let navBarIndex = e.currentTarget.dataset.navbarIndex;
    this.setData({
      navbarActiveIndex: navBarIndex
    })
  },
  onBindAnimationFinish(detail) {//导航下部内容滑动
    console.log(detail)
    this.setData({
      navbarActiveIndex:detail.detail.current
    })
  },
  shopQuery(e) {//商品点击事件
    console.log(e);
  },
  selectShop:function (e) {
    console.log(e)
    console.log(this.detail)
  },
  change(e) {//商品导航下拉指定位置
    this.setData({
      indexSize: e.detail.current
    })
    console.log(e)
  },
  scrollTo(e) {
    this.setData({
      indexSize: e.target.dataset.index
    })
    console.log(e)
  },
  queryShopChild:function () {
    var that = this;
    service.request('findByMerchatChidId',{merchantid:that.data.shopid,userid:that.data.userid}).then((res)=>{
      console.log(res);
      var typeList = res.data.data.type;
      that.setData({
        detail:typeList
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      userid:options.userid,
      shopid:options.shopid
    })
    that.queryShopChild();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight -res.windowWidth / 750 * 416
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