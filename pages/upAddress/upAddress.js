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
    longitude:null,
    latitude:null,
    userid:null,//用户id
    addressNum:null,//门牌号
    name:null,//姓名
    phone:null,//电话号码
    sex:null,//性别
    id:null,//修改时需要穿的地址
    address:null,//选择地址后的地名
  },
  queryMap:function() {//查询地图
    var that =this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address
        })
        console.log(res);

      },
    })
  },
  radioChange:function(e) {//获取男女关系
    console.log(e);
    this.setData({
      sex:e.detail.value

    })
  },
  save:function(){//新添加收件地址
  var newAddress = this.data.address + "&" + this.data.addressNum;
    service.request("addByDistance", { longitude: this.data.longitude, latitude: this.data.latitude, userid: this.data.userid, address: newAddress,name:this.data.name,phone:this.data.phone,sex:this.data.sex,id:0}).then((res)=>{
      console.log(res);
      if(res.data.retCode ==200) {
        wx.navigateBack({
          delta: 1,
          success: function () {
            console.log(res);
          }
        });
      }else {
        wx.showModal({
          // title: "温馨提示",
          content: '请填写完整信息',
          cancelText: "确定",
          cancelColor: "#00D4A0",
          // confirmText: "我知道了",
          // confirmColor: "#00D4A0",
          success(res) {
            if (res.cancel) {
              // var shopList = e.currentTarget.dataset.itemlist
              // app.globalData.commercial = shopList;
              // var userId = app.globalData.userData.id;//获取的用户id
              // var shopId = e.currentTarget.dataset.bindid
              // wx.navigateTo({
              //   url: '/pages/shopDetails/shopDetails?' + "shopid=" + shopId + "&userid=" + userId,
              // })
              console.log("取消按钮")
            }
          }
        })
      }
    })
  },
  inputValue:function(e) {//input框失去焦点后的值
    console.log(e);
    this.setData({
      phone:e.detail.value,
    })
  },
  contactValue:function(e) {//联系人框
    this.setData({
      name: e.detail.value,
    })
  },
  houstValue:function(e) {//房子的门牌号
    this.setData({
      addressNum: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userid:options.userid
    })
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