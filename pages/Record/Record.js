// pages/Record/Record.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redList:null,//钱包集合
    chidList:[],//详情集合
    account:0,//支出金额
    income:0,//收入金额
  },
  queryCord:function () {//查询用户钱包
    var that = this;
    var userid = app.globalData.userData.id;
    service.request('findDyReCord',{id:userid}).then((res)=>{
      console.log(res);
      that.setData({
        redList:res.data.data,
        chidList: res.data.data.recordList
      })
      var list = res.data.data.recordList;
      var account = 0;//支出总额
      var income = 0;//收入的总额
      for(var i=0;i<list.length;i++) {
        var chidMoney = list[i];
        if(chidMoney.type == 2 || chidMoney.type == 4) {
          account += chidMoney.money
        }else {
          income += chidMoney.money;
        }
      }
      that.setData({
        account:account.toFixed(2),
        income:income.toFixed(2)
      })
      console.log(account,income);
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
    this.queryCord();
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