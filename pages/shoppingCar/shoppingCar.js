// pages/shoppingCar/shoppingCar.js
const app = getApp()
const service = require('../../utils/myapi.js')
var page = null;
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
    checkedType:false,//全选选中的效果
    shopAllMoney:0,//选中商品的所有数量
    checkShopId:null,//当前商品列表的位置
    CarllIdList:[],//
    disable:false,//全选框禁用
  },

  /*页面的点击函数*/
  moveNum: function (e) {//点击减少商品数量
    console.log(e)
    var that = this;
    var shopALLCar = that.data.CarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = e.currentTarget.dataset.childitem.number;
    var shopId = e.currentTarget.dataset.childitem.id;
    console.log(listChildNum)
    var shopId = e.currentTarget.dataset.shopid;
    if (listChildNum == 1) {
      service.request('deletShopping', { shoppingCarId: shopId, userid: that.data.userid }).then((res) => {
        console.log(res);
        if (res.data.retCode == 200) {
          that.queryAllCar()
        }
      })
    } else if (listChildNum > 1) {
      service.request('shoppingCar', { userid: that.data.userid, symbol: "%2D", shopid: shopId }).then((res) => {
        console.log(res);
        if (res.data.retCode) {
          that.queryAllCar()
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
    var shopALLCar = that.data.CarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = e.currentTarget.dataset.childitem.number;
    var shopId = e.currentTarget.dataset.childitem.id;
    console.log(listChildNum)
    var shopId = e.currentTarget.dataset.shopid;
    listChildNum++;
    service.request('shoppingCar', { userid: that.data.userid, symbol: "%2B", shopid: shopId }).then((res) => {
      console.log(res);
      if (res.data.retCode) {
        that.queryAllCar()
      }
    })
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
  queryAllCar:function () {//查询所有购物车的商品
    var that = this;
    // debugger
    service.request('findByShopCarAll',{userid:that.data.userid,status:0}).then((res)=>{
      console.log(res.data.data);
      var listData = res.data.data;
      for (var i = 0; i < listData.length;i++) {
        var listChid = listData[i].data;
            listData[i].checkedAFa = false;
        listData[i].money = 0;
        for(var j=0;j<listChid.length;j++) {
          listChid[j].checked = false;
        }
      }
      if(res.data.retCode == 200) {
        that.setData({
          CarList: listData
        })
      }
    })
  },
  sum:function (value) {//购物车的钱相加
    var s = 0;
    value.forEach(function (val, idx, arr) {
      s += parseFloat(val);
    }, 0);

    return s;
  },

  checkboxChange:function(e) {//单选框选中效果
    console.log(e);
    // debugger;
    var checkid = e.currentTarget.dataset.id;
    var leg = e.detail.value.length;
    var value = e.detail.value;
    var CarList = this.data.CarList
    var newValue=this.sum(value);
    var money = 'CarList['+ checkid +'].money';
    var checkedAFa = 'CarList[' + checkid + '].checkedAFa'
    // debugger;
    if(value.length == CarList[checkid].data.length) {
      this.setData({
        [checkedAFa]:true
      })
    }else {
      this.setData({
        [checkedAFa]: false
      })
    }
    console.log(checkid, CarList)
    console.log(newValue);
    for(var i = 0;i<value.length;i++) {
      var id = value[i].split(',');
      var newid = id[1]
      var tf = this.data.checkedType
      var CarList = this.data.CarList;
      var carLIST = CarList[checkid].data[newid].checked = (!tf)
      // var type = 'CarList[' + checkid + '].data[' + newid + '].checked'
      // this.setData({
      //   CarList: CarList
      // })
    }
    this.setData({
      [money]:newValue,
      // shopCarId: e.detail.value,
      length:leg,
      shopAllMoney:newValue,
      checkShopId:checkid,
    })
    // console.log(this.data.length);
  },

  bechi:function(e){//全选和取消全选
    console.log(e);
    var list = this.data.CarList;
    var id = e.currentTarget.dataset.id
    var type = list[id].checkedAFa;
    type = (!list[id].checkedAFa);
    var smoney = 0;
    // debugger;
    if (type) {
        var chidList = list[id].data;
        list[id].checkedAFa = true;
        for (var j = 0; j < chidList.length;j++) {
          chidList[j].checked = true;
          var money = chidList[j].price * chidList[j].number;
          smoney +=money;
        }
      list[id].money = smoney
        this.setData({
          CarList: list
        })

        console.log(this.data.shopAllMoney)
      }else {
        var chidList = list[id].data;
        list[id].checkedAFa = false;
        for (var j = 0; j < chidList.length; j++) {
          chidList[j].checked = false;
        }
        list[id].money = 0
        this.setData({
          CarList: list
        })
      }

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
  goCar:function(e) {//前往支付页面
    var that =this;
    console.log(e);
    var id = e.currentTarget.dataset.item.data[0].merchantid
    var arr = [];
    var index = e.currentTarget.dataset.checkid;
    var list = that.data.CarList[index].data;
    console.log(list);
    for(var i = 0;i<list.length;i++) {
      var shopChid = list[i];
      if(shopChid.checked) {
        arr.push(shopChid.id)
      }
      app.globalData.shopUpId = arr;
      console.log(arr,app.globalData.shopUpId)
    }
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?' + 'userid=' + that.data.userid + "&shopid=" + id
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