// pages/payOrder/payOrder.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '达达配送', value: '1',checked: 'true' },
      { name: '字取自送', value: '2' },
    ],
    checkbox:[
      {name:'lazyRed',value:'1'},
      { name: 'lazyRed', value: '2' },
      { name: 'lazyRed', value: '3' },
    ],
    userid:null,//用户id
    shopid:null,//商户id
    Carid:[],//购物车id集合
    CarOrder:null,//查询订单返回的数据
    Distance:[],//收货地址集合
    takeoff:0,//取送费
    disableType:false,//地址模块出现
    defaultDistance:null,//默认收货地址
    DistanceType:false,//模态框的出现和隐藏
    timeType:false,//选择取件时间type
    navbarActiveIndex:0,//选中的时间index初始值
    yearStrin:null,//选中的时间年份
    yourString:null,//选中的取件时间的毫秒
    immediately:1,//0为不是立即取件。一为立即取件
    year: ["2019-03-22", "2019-03-22", "2019-03-22", 
    "2019-03-22", "2019-03-22", "2019-03-22", "2019-03-22",
     "2019-03-22", "2019-03-22", "2019-03-22",],//取件得日期
    your: ["10:00:00", "10:00:00", "10:00:00", "10:00:00", "10:00:00", "10:00:00", "10:00:00", "10:00:00",]//取件得时刻
  },

  /*页面事件 */
  radioChange:function (e) {//取送方式
    console.log(e.detail.value);
  },
  quryOrder:function() {//获取本页面得基本数据
    var that =this;
    var id = that.data.Carid
    var newID=id.join(',')
    console.log(id);
    service.request('subminssion', { userid: that.data.userid, merchantid: that.data.shopid, shopId: newID}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200 && res.data.data!=null) {
        that.setData({
          CarOrder:res.data.data
        })
        console.log(that.data.CarOrder)
      }
    })
  },
  queryAddress:function() {//点击出现地址选择框
    this.setData({
      DistanceType:true,
      disableType:true,
      timeType:false
    })
  },
  queryTime:function() {//点击出现选择时间
    this.setData({
      DistanceType: true,
      timeType: true,
      disableType: false,
    })
  },
  showAddShop:function () {//点击外层模态框消失
    this.setData({
      DistanceType: false,
    })
  },
  address:function() {//点击模态框内容部分不隐藏
    this.setData({
      DistanceType: true,
    })
  },
  setYear:function(e) {//选择取件时间的日期
    // console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    var year = e.currentTarget.dataset.year
    that.setData({
      navbarActiveIndex:index,
    })
  },
  setYour:function(e) {//选取时分秒的时间
    console.log(e);
    var that = this;
    var your = e.currentTarget.dataset.your
    var year = e.currentTarget.dataset.year
    that.setData({
      yourString: your,
      yearStrin:year,
      DistanceType:false,
      immediately:0
    })
  },
  allright:function() {//点击出现立刻取件
    this.setData({
      immediately:1,
      DistanceType: false,
      timeType: false,
      disableType: false,
    })
  },
  qeryDistance:function() {//查询用户的所有地址
    var that =this;
    service.request('allByDistance',{merchantid:that.data.shopid,userid:that.data.userid}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200 && res.data.data.addressList!=null) {
        that.setData({
          takeoff:res.data.data.takeoff,
          Distance:res.data.data.addressList
        })
        var DistanceList = that.data.Distance;
        for (var i = 0; i < DistanceList.length; i++) {
          var chid = DistanceList[i];
          if (chid.ifSelect == 1) {
            that.setData({
              defaultDistance: chid
            })
          }
        }
      }
    })
  },
  goUpAdd:function(e) {
    console.log(e);
    wx.navigateTo({
      url:'/pages/upAddress/upAddress'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    console.log(options);
    console.log(app.globalData.shopUpId)
    that.setData({
      userid:options.userid,
      shopid:options.shopid,
      Carid: app.globalData.shopUpId
    });
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
    var that =this;
    that.quryOrder();
    that.qeryDistance();
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