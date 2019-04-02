const app = getApp()
const service = require('../../utils/myapi.js')
const MD5 = require('../../utils/MD5.js')
var arr =[];//数据的空数组；
Page({
  data: {
    latitude: 30.562261,
    longitude: 104.062500,
    markers:[],//地图标点的位置集合
    dadaList:null,//达达位置信息
    orderNum:null,//查询达达订单号
  },
  onReady: function (e) {//创建地图初始化
    this.mapCtx = wx.createMapContext('myMap')
  },
  queryMap:function(order) {//查询达达地图
    var that = this;
    service.request('queryMap', { ordernum:order}).then((res)=>{
      console.log(res);
      var shopList = res.data.data.orderModel;//商家的信息
      var dadaList = res.data.data.dadaResponse;//达达的物流信息
      var type = res.data.data.order_id;//物流消息是否有效
      var typeDada = dadaList.dadaRespose.code;//达达请求成功订单标识 0为请求成功，其他为无效;
      var dadaMes = dadaList.result;//达达物流的详细信息
      var yh = {//用户的信息
        id: 1,
        latitude: shopList.latitude,
        longitude: shopList.longitude,
        name: '用户的经纬度',
        iconPath:'/images/overall/zhong@3x.png',
        width:'35rpx',
        height:'40rpx'
      };
      var sh = {//商户户的信息
        id: 2,
        latitude: shopList.merchantLat,
        longitude: shopList.merchantLog,
        name: '商户的经纬度',
        iconPath: '/images/overall/qi@3x.png',
        width: '35rpx',
        height: '40rpx'
      }
      if(typeDada == 0) {
        var dada = {//达达的位置//
          id: 3,
          latitude: dadaMes.transporterLat,
          longitude: dadaMes.transporterLng,
          name: '骑手位置',
          iconPath: '/images/overall/qishou@3x.png',
          width: '45rpx',
          height: '50rpx'
        }
      }
      if(type == 1) {//取衣服
        var quimg = "marker[0].iconPath"
        var song = "marker[1].iconPath"
        this.setData({
          [quimg]: '/images/overall/qi@3x.png',
          [song]: '/images/overall/zhong@3x.png',
         latitude: shopList.latitude,
          longitude: shopList.longitude,
        })

      }else if(type == 2) {//送衣服
        var quimg = "marker[0].iconPath"
        var song = "marker[1].iconPath"
        this.setData({
          [quimg]: '/images/overall/zhong@3x.png',
          [song]:  '/images/overall/qi@3x.png',
          latitude: shopList.merchantLat,
          longitude: shopList.merchantLog,
        })

      }else{//物流订单为坏订单
        this.setData({
          latitude: shopList.latitude,
          longitude: shopList.longitude,
        })
      }
      arr.push(yh, sh, dada);
      console.log(arr)
      that.setData({
        markers:arr,
        dadaList: dadaMes
      })
    })
  },
  upload:function() {//刷新达达的物流位置
    var that = this;
    var order = that.data.orderNum;
    that.queryMap(order)
    // var orderNum = that.data.orderNum
    // var marsL = "markers[2].latitude";
    // var marLo = "markers[2].longitude"
    // that.setData({
    //   [marsL]: '30.987028',
    //   [marLo]: '104.468994'
    // })
    // this.mapCtx.translateMarker({
    //   markerId: 3,//所要操作的标记ID，在data中已预先定义
    //   autoRotate: false,
    //   rotate: 0,
    //   duration: 100,
    //   destination: {//新的坐标值
    //     latitude: '30.987028',
    //     longitude:'104.468994',
    //   },
    //   animationEnd() {
    //     console.log('animation end');
    //     console.log(that.data.markers)
    //   }

    // })
  },
  onLoad:function(options) {
    console.log(options);
    var ordernum = options.orderNum;
    this.setData({
      orderNum:ordernum
    })
    this.queryMap(ordernum);
  },
  onShow:function() {
    this.queryMap();
  }
})
