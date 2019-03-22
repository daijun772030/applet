// pages/upAddress/upAddress.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
const app = getApp()
const service = require('../../utils/myapi.js')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {name:'先生',value:1},
      {name:'女士',value:2}
    ],
    addAll:{
      longitude:null,
      latitude:null,
      userid:null,//用户id
      address:null,//门牌号
      name:null,//姓名
      phone:null,//电话号码
      sex:null,//性别
      id:null,//修改时需要穿的地址
    }
  },
  queryMap:function() {//查询地图
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'SJYBZ-B6VH5-BKOIZ-QTJRE-F6NQ2-BNF37'
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