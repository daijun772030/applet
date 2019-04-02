// pages/order/order.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:null,//用户id
    orderLlist: [
      { name: '全部', value: 1 },
      { name: '待付款', value: 2 },
      { name: '待接单', value: 3 },
      {name:'待取货',value:4},
      { name: '待发货', value: 5 },
      { name: '待收货', value: 6 },
      { name: '待评价', value: 7 },
      // { name: '退款', value: 8 }
    ],
    navbarActiveIndex: 0,//导航和下面商品的联动
    duration: 100,//滑动时常
    circular: true,//是否衔接动画
    second_height: null,//滑动得高度
    allOrder:[],//全部商品
    obligation:[],//待付款
    waitOrder:[],//待接单
    waitPickup:[],//待取货    
    dendOrder:[],//待发货
    takeOrder:[],//待收货
    waitAppraise:[],//待评价
    refund:[],//退款
    arrAll:[],//需要渲染的所有对象的数组
  },
  queryNathing:function (value) {//查询订单函数
    // wx.showToast({
    //   title: '稍等',
    //   icon:'loading',
    //   duration:4000,
    //   mask:true
    // })
    if (value == 0) {//所有订单
      var type = 6;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        
        var arrdata = res.data.data;
        var arr = [];
        arr = arrdata;
        if(arr.length>80) {
          arr.length = 80;
        }
        // for(var i = 0;i<80;i++) {
        //   arr.push(arrdata[i]);
        // }
        console.log(arr);
        this.setData({
          allOrder: arr
        })
        console.log(this.data.allOrder);
        var arrAll = [];
        arrAll = arr;
        this.setData({
          arrAll:arrAll
        })
        console.log(this.data.arrAll)
      })
    } else if (value == 1) {//待付款
      var type = 0;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        var obligation = res.data.data;
        var arr = [];
        for (let i = 0; i < obligation.length; i++) {
          var chid = obligation[i]
          if (chid.status == 0 || chid.status == 1) {
            arr.push(chid)
          }
        }
        this.setData({
          obligation: arr
        })
        var arrAll = [];
        console.log(this.data.obligation)
        arrAll = this.data.obligation
        this.setData({
          arrAll: arrAll
        })
        console.log(this.data.arrAll)
      })
    } else if (value == 2) {//待接单
      var type = 1;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        var valueChid = res.data.data;
        console.log(valueChid)
        var arr = [];
        for(let i = 0; i < valueChid.length; i++) {
          // debugger;
          var chid = valueChid[i]
          console.log(chid)
          if (chid.status == 2&&chid.refundStatus == 10&&chid.type == 0) {
            arr.push(chid)
            console.log(arr)
          }
        }
        this.setData({
          waitOrder: arr
        })
        var arrAll = [];
        console.log(this.data.waitOrder)
        arrAll = this.data.waitOrder
        this.setData({
          arrAll: arrAll
        })
        console.log(this.data.arrAll)
      })
    } else if (value == 3) {//待取货
      var type = 2;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        var valueChid = res.data.data;
        var arr = [];
        for (let i = 0; i < valueChid.length; i++) {
          var chid = valueChid[i]
          if (chid.status == 2&&chid.refundStatus == 10&&chid.type == 1&&chid.ifhave != 1&&chid.ifhave != 2) {
            arr.push(chid)
          }
        }
        this.setData({
          waitPickup: arr
        })
        var arrAll = [];
        arrAll = this.data.waitPickup
        this.setData({
          arrAll: arrAll
        })
      })
    }else if(value == 4) {//待发货
      var type = 2;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        // debugger;
        var valueChid = res.data.data;
        var arr = [];
        for (let i = 0; i < valueChid.length; i++) {
          var chid = valueChid[i]
          if (chid.status == 2&&chid.refundStatus == 10&&chid.type == 1 && (chid.ifhave == 1||chid.ifhave == 2)) {
            arr.push(chid)
          }
        }
        this.setData({
          dendOrder: arr
        })
        var arrAll = [];
        arrAll = this.data.dendOrder
        this.setData({
          arrAll: arrAll
        })
      })
    }else if (value == 5) {//待收货
      var type = 3;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        var valueChid = res.data.data;
        console.log(res);
        var arr = [];
        for (let i = 0; i < valueChid.length; i++) {
          // debugger;
          var chid = valueChid[i]
          if (chid.status == 2&&chid.refundStatus == 10&&chid.type == 2) {
            arr.push(chid)
          }
        }
        this.setData({
          takeOrder: arr
        })
        var arrAll = [];
        arrAll = this.data.takeOrder
        this.setData({
          arrAll: arrAll
        })
      })
    } else if (value == 6) {//待评价
      var type = 4;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        var arr = [];
        var valueChid = res.data.data;
        for (let i = 0; i < valueChid.length; i++) {
          var chid = valueChid[i]
          if (chid.status == 2&&chid.refundStatus == 10&&chid.type == 3) {
            arr.push(chid)
          }
        }
        this.setData({
          waitAppraise: arr
        })
        var arrAll = [];
        arrAll = this.data.waitAppraise
        this.setData({
          arrAll: arrAll
        })
      })
    } else if (value == 7) {//退款订单
      var type = 7;
      service.request('orderAll', { userid: this.data.userid, type: type }).then((res) => {
        console.log(res);
        var arr = [];
        var valueChid = res.data.data;
        for (let i = 0; i < valueChid.length; i++) {
          var chid = valueChid[i]
          if (chid.status == 2&&(chid.type == 7 || chid.refundStatus !=10)) {
            arr.push(chid)
          }
        }
        this.setData({
          refund: res.data.data
        })
        var arrAll = [];
        arrAll = this.data.refund
        this.setData({
          arrAll: arrAll
        })
      })
    }
  },
  onNavBarTap(e) {//页面上部导航条的点击跳转
    var that = this;
    // debugger;
    let navBarIndex = e.currentTarget.dataset.navbarIndex;
    this.setData({
      navbarActiveIndex: navBarIndex
    })
    that.queryNathing(navBarIndex)
  },
  onBindAnimationFinish(detail) {//导航下部内容滑动
    console.log(detail)
    this.setData({
      navbarActiveIndex: detail.detail.current
    })
    var index = this.data.navbarActiveIndex;
    this.queryNathing(index);
    console.log(this.data.waitOrder)
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /*按钮的各种状态*/
  deleteOrder:function(e) {//待支付的订单删除订单按钮
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.item.id;
    service.request('deleteOrder',{orderId:id}).then((res)=>{
      console.log(e);
      that.queryNathing(index);
    })
  },
  callPhone:function(e) {//联系商家的按钮
    console.log(e);
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  refundMsg:function(e) {//跳转退款详情
    console.log(e);
    var id = e.currentTarget.dataset.item
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/refundMsg/refundMsg?id=' + id + '&type=' + type,
    })
  },
  refund:function(e) {//取消订单、退款
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var orderNum = e.currentTarget.dataset.item.orderNum
    service.request('wxRefund', { out_trade_no: orderNum,remark:' ' }).then((res) => {
      console.log(res);
      that.queryNathing(index);
    })
  },
  orderMsg:function(e) {//跳转订单详情
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var item = e.currentTarget.dataset.item;
    app.globalData.shopMsg = item;
    wx.navigateTo({
      url: '/pages/complete/complete?id=' + id + '&type=' + type,
    })
  },
  affirm:function(e) {//前往支付订单
    console.log(e)
    var id = e.currentTarget.dataset.item.merchantid;
    var list = e.currentTarget.dataset.item.shoppingCarModelList;
    var arr = [];
    for (var i = 0; i < list.length;i++) {
      arr.push(list[i].id);
    }
    app.globalData.shopUpId = arr;
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?' + 'userid=' + this.data.userid + "&shopid=" + id
    })
  },
  comDelivery:function(e) {
    console.log(e);
  },
  /*end*/
  orderAll:function (type) {//查询所有订单
    if(this.data.userid) {
      service.request('orderAll', { userid: this.data.userid, type: type}).then((res) => {
        console.log(res);
        return res.data.data
      })
    }
  },
  seeDada:function(e) {//待收货和待取件时的查看物流达达物流
    var orderNum = e.currentTarget.dataset.item.orderNum;
    console.log(e);
    wx.navigateTo({
      url: '/pages/map/map?orderNum=' + orderNum,
    })
  },
  Remind:function() {//提醒接单
    wx.showToast({
      title: '我们已帮您提醒商家',
      icon: 'none',
      duration: 1500,
      mask: true,
    })
  },
  Confirm: function (e) {//确认发货
    console.log(e);
    var that = this;
    var list = e.currentTarget.dataset.item;
    if (list.ifhave == 2) {
      if (list.iftake == 1) {
        wx.showToast({
          title: '您选择的是自取自送，请上门收取衣物！',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      } else {
        console.log('这是达达的订单')
        service.request('updateOrder', { type: 2, orderId: list.id, outTradeNo: list.orderNum }).then((res) => {
          console.log(res);
          var index = that.data.navbarActiveIndex;
          that.queryNathing(index);
        })
      }
    }
  },
  receipt:function(e) {//确认收货/这是自取自送
    console.log(e)
    var list = e.currentTarget.dataset.item;
    service.request('updateOrder', { type: 3, orderId: list.id, outTradeNo: list.orderNum }).then((res) => {
      console.log(res);
      var index = that.data.navbarActiveIndex;
      that.queryNathing(index);
    })
  },
  evaluate:function() {
    wx.showToast({
      title: '暂不支持评论，前往APP进行评论',
      icon: 'none',
      duration: 1500,
      mask: true,
    })
  },
  buyAway:function(e) {//再次购买商品跳转选择商品页面
    console.log(e);
    var shopid = e.currentTarget.dataset.item.merchantid;
    var userid = app.globalData.userData.id;
    wx.navigateTo({
      url: '/pages/shopDetails/shopDetails?shopid=' + shopid + '&userid=' + userid,
    })
  },
  onLoad: function (options) {
    console.log(app.globalData.userData);
    console.log(options)
    var id = app.globalData.userData.id;
    var that = this;
    var type = 6;
    var index = options.index;
    that.setData({
      userid:id,
      navbarActiveIndex:index
    })
    that.queryNathing(index);
    that.orderAll(type);
    // that.orderAll();
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
    // var type = 6;
    // var index = this.data.navbarActiveIndex;
    // this.queryNathing(index);
    // this.orderAll(type);
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