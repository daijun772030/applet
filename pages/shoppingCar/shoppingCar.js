// pages/shoppingCar/shoppingCar.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:null,//用户id
    shopid:null,//商户id
    CarList:[],//购物车的数组
    shopCarId:[],//购物车数组id集合
    length:0,//购物车选中数组长度
  },

  /*页面的点击函数*/
  moveNum: function (e) {//点击减少商品数量
    console.log(e)
    var that = this;
    var shopALLCar = that.data.CarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = e.currentTarget.dataset.childitem.number;
    console.log(listChildNum)
    var shopId = e.currentTarget.dataset.shopid;
    if (listChildNum == 1) {
      service.request('deletShopping', { shoppingCarId: shopId, userid: that.data.userid }).then((res) => {
        console.log(res);
        if (res.data.retCode == 200) {
          that.findShopCar();
        }
      })
    } else if (listChildNum > 1) {
      service.request('shoppingCar', { userid: that.data.userid, symbol: "%2D", shopid: shopId }).then((res) => {
        console.log(res);
        if (res.data.retCode) {
          that.findShopCar();
        }
      })
    }
    listChildNum--;
    var reallyNum = 'shopALLCar[" + listId +"].number'
    shopALLCar.forEach((item, index, arr) => {
      var sItem = "shopCarList[" + index + "].number";
      console.log(sItem);
      if (index == listId) {
        that.setData({
          [sItem]: listChildNum
        });
      }
    })

    console.log(listChildNum, shopALLCar);
  },
  pushNum: function (e) {//点击增加商品数量
    console.log(e)
    var that = this;
    var shopALLCar = that.data.shopCarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = shopALLCar[listId].number;
    var shopId = e.currentTarget.dataset.shopid;
    listChildNum++;
    var reallyNum = 'shopALLCar[" + listId +"].number'
    shopALLCar.forEach((item, index, arr) => {
      var sItem = "shopCarList[" + index + "].number";
      console.log(sItem);
      if (index == listId) {
        that.setData({
          [sItem]: listChildNum
        });
        service.request('shoppingCar', { userid: that.data.userid, symbol: "%2B", shopid: shopId }).then((res) => {
          console.log(res);
          if (res.data.retCode) {
            that.findShopCar();
          }
        })
      }
    })

    console.log(listChildNum, shopALLCar);
  },
  queryAllCar:function () {
    var that = this;
    service.request('findByShopCarAll',{userid:that.data.userid,status:0}).then((res)=>{
      console.log(res.data.data);
      if(res.data.retCode == 200) {
        that.setData({
          CarList:res.data.data
        })
      }
    })
  },
  checkboxChange:function(e) {//单选框选中效果
    console.log(e);
    var leg = e.detail.value.length;
    this.setData({
      shopCarId: e.detail.value,
      length:leg
    })
    console.log(this.data.length);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      userid: options.userid,
      shopid: options.shopid,
    })
    that.queryAllCar();
  },
  goCar:function() {
    var that =this;
    var shopCarList = that.data.shopCarId.join(',');
    // var listCar = StringUtils.join(shopCarList,",")

    console.log(shopCarList)
    // console.log(listCar)
    service.request('subminssion', { userid: that.data.userid, merchantid: that.data.shopid, shopId: shopCarList}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200) {
        app.globalData.shopCarList = res.data.data;
        wx.navigateTo({
          url: '/pages/payOrder/payOrder?' + 'userid=' + that.data.userid + "&shopid=" + that.data.shopid
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