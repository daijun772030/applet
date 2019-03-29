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
      {name:'先生',value:1,checked:true},
      {name:'女士',value:2}
    ],
    longitude:null,
    latitude:null,
    userid:null,//用户id
    addressNum:null,//门牌号
    name:null,//姓名
    phone:null,//电话号码
    sex:1,//性别
    id:0,//修改时需要穿的地址
    address:null,//选择地址后的地名
    addNam:null,//页面需要展示的地址
    qi:null,//除开省市区以外的地址
  },
  queryMap:function() {//查询地图
    var that =this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          addNam:res.name
        })
        console.log(res);
        var list = res.address.split('区');
        console.log(list)
        var qi = list[1]
        var add = that.getArea(res.address)
        var newadd = add.Province + " " + add.Country + " " + add.City
        that.setData ({
          address:newadd,
          qi:qi
        })
      },
    })
  },


  getArea: function (str) {//区分省市区
    let area = {}
    let index11 = 0
    let index1 = str.indexOf("省")
    if (index1 == -1) {
      index11 = str.indexOf("自治区")
      if (index11 != -1) {
        area.Province = str.substring(0, index11 + 3)
      } else {
        area.Province = str.substring(0, 0)
      }
    } else {
      area.Province = str.substring(0, index1 + 1)
    }

    let index2 = str.indexOf("市")
    if (index11 == -1) {
      area.City = str.substring(index11 + 1, index2 + 1)
    } else {
      if (index11 == 0) {
        area.City = str.substring(index1 + 1, index2 + 1)
      } else {
        area.City = str.substring(index11 + 3, index2 + 1)
      }
    }

    let index3 = str.lastIndexOf("区")
    if (index3 == -1) {
      index3 = str.indexOf("县")
      area.Country = str.substring(index2 + 1, index3 + 1)
    } else {
      area.Country = str.substring(index2 + 1, index3 + 1)
    }
    return area;

  },


  radioChange:function(e) {//获取男女关系
    console.log(e);
    this.setData({
      sex:e.detail.value

    })
  },
  save:function(){//新添加收件地址
    var addList = app.globalData.addressList;
    // debugger;
    if(addList) {
      this.setData({
        id:addList.id
      })
    }
    var newAddress = this.data.address + " " + this.data.addNam + "%26" + this.data.qi + "%26" + this.data.addressNum;
    service.request("addByDistance", { longitude: this.data.longitude, latitude: this.data.latitude, userid: this.data.userid, address: newAddress, name: this.data.name, phone: this.data.phone, sex: this.data.sex, id:this.data.id}).then((res)=>{
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
    var userId = app.globalData.userData.id;//获取的用户id
    this.setData ({
      userid: userId
    })
    var addList = app.globalData.addressList;
    if(addList) {
      console.log(addList);
      var addNum = addList.address.split('&');
      var length = addNum.length - 1;
      var newNum = addNum[length]
      console.log(newNum)
      this.setData({
        userid: app.globalData.userData.id,
        longitude: addList.longitude,
        latitude: addList.latitude,
        addressNum: newNum,//门牌号
        name: addList.name,//姓名
        phone: addList.phone,//电话号码
        sex: addList.sex,//性别
        address: addNum[0],
        addNam: addNum[1]

      })
      if (addList.sex == 1) {
        var checed = "items[" + 0 + "].checked"
        this.setData({
          [checed]: true,
          [ched]: false
        })
      } else {
        var checed = "items[" + 0 + "].checked";
        var ched = "items[" + 1 + "].checked"
        this.setData({
          [checed]: false,
          [ched]: true
        })
      }
    }
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