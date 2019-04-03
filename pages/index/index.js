//index.js
//获取应用实例
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
const app = getApp()
const service = require('../../utils/myapi.js')
var qqmapsdk;
var page = 1
Page({
  data: {
    top:0,
    mapName:'',
    latitude: '',
    longitude: '',
    pageNum:'1',//查询商家店铺的页码
    type:'0',//商户排序的规则
    navImg: [],//轮播图
    noticeMessg:[],//公告内容
    shopList:[],//首页底部商家
    navList:[//首页导航
      { img:'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/chenyi@2x.png',text:'洗衣到家'},
      { img:'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/saozhou@2x.png',text:'保洁到家'},
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/shizhong@2x.png', text: '小时工到家' },
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/chengshi@2x.png', text: '社区服务' }
    ],
    navList1: [//首页导航
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/bossquan_icon_shouye@2x.png', text: 'boss圈' },
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/xiyihaocai_icon_shouye@2x.png', text: '洗衣耗材' },
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/xiyishebei_icon_shouye@2x.png', text: '洗衣设备' },
      { img: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/tuwenjiaocheng_icon_shouye@2x.png', text: '图文教程' }
    ],
    quality: [],//优质商家
    navSate:{
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular:true,
      indicatorColor:'rgba(0,227,171,1)',
      indicatorActiveColor:'rgba(255,255,255,1);'
    },
    select:"综合排序",
    num:4, //店铺评分相应小星星
    one_1:'',
    two_1:'',
    scrollTop:0,
    loadtType:false,//触底刷新
    loadNanme:'努力加载更多...',//loading的名字
  },

  goshop:function(e) {
    console.log(e);
    var shopid = e.currentTarget.dataset.shopid;
    if (app.globalData.userData) {
      wx.showModal({
        title: "温馨提示",
        content: '距离超过2km,配送费会根据距离进行适当增加，请谅解',
        cancelText: "再看看",
        cancelColor: "#000000",
        confirmText: "我知道了",
        confirmColor: "#00D4A0",
        success(res) {
          if (res.confirm) {
            var shopList = e.currentTarget.dataset.itemlist
            app.globalData.commercial = shopList;
            var userId = app.globalData.userData.id;//获取的用户id
            var shopId = e.currentTarget.dataset.bindid
            wx.navigateTo({
              url: '/pages/shopDetails/shopDetails?' + "shopid=" + shopId + "&userid=" + userId,
            })
          } else if (res.cancel) {
            console.log("取消按钮")
          }
        }
      })
    } else {
      wx.showModal({
        title: "温馨提示",
        content: '您还未登录，前去登录',
        cancelText: "算了",
        cancelColor: "#000000",
        confirmText: "去登录",
        confirmColor: "#00D4A0",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log("取消按钮")
          }
        }
      })
    }
  },
  //事件处理函数
  GOShopDetails:function(e) {//这里是商家展示
    console.log(e);
    var km = e.currentTarget.dataset.itemlist.distance
    var that = this;
    if(app.globalData.userData || km<2) {
      if(km>2) {
        wx.showModal({
          title: "温馨提示",
          content: '距离超过2km,配送费会根据距离进行适当增加，请谅解',
          cancelText: "再看看",
          cancelColor: "#000000",
          confirmText: "我知道了",
          confirmColor: "#00D4A0",
          success(res) {
            if (res.confirm) {
              var shopList = e.currentTarget.dataset.itemlist
              app.globalData.commercial = shopList;
              var userId = app.globalData.userData.id;//获取的用户id
              var shopId = e.currentTarget.dataset.bindid
              wx.navigateTo({
                url: '/pages/shopDetails/shopDetails?' + "shopid=" + shopId + "&userid=" + userId,
              })
            } else if (res.cancel) {
              console.log("取消按钮")
            }
          }
        })
      }else {
        var shopList = e.currentTarget.dataset.itemlist
        app.globalData.commercial = shopList;
        var userId = app.globalData.userData.id;//获取的用户id
        var shopId = e.currentTarget.dataset.bindid
        wx.navigateTo({
          url: '/pages/shopDetails/shopDetails?' + "shopid=" + shopId + "&userid=" + userId,
        })
      }
    }else {
      wx.showModal({
        title: "温馨提示",
        content: '您还未登录，前去登录',
        cancelText: "算了",
        cancelColor: "#000000",
        confirmText: "去登录",
        confirmColor: "#00D4A0",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log("取消按钮")
          }
        }
      })
    }
  },
  scroll(e) {//gundong
    console.log(e); 
    // let that = this;
    // that.setData({
    //   scrollTop:e.detail.scrollTop
    // })
  },
  downPart(page) {//查询商铺
    const that = this;
    service.request('downPart', { longitude: that.data.longitude, latitude: that.data.latitude, type: '0', pageNum: page,                       type:that.data.type }).then((res) => {
      console.log(res);
      that.screening(res);
      if (res.data.retCode == 200 && res.data.data.merchant.length == 0) {
        that.setData({
          loadtType: true,
          loadNanme: '已加载完成全部商家'
        })
      } else {
        that.setData({
          loadtType: false
        })
      }
    })
  },
  screening:function (listAll) {//筛选商家函数
    var that = this;
    var merchant = listAll.data.data.merchant;
    console.log(listAll.data.data.merchant)
    for (var w = 0; w < merchant.length; w++) {
      // debugger;
      var list = merchant[w].discountModelList;
      if (list.length > 0) {
        //先选出打折商品重复
        for (var i = 0; i < list.length - 1; i++) {
          for (var j = i + 1; j < list.length; j++) {
            if (list[i].type == list[j].type) {
              list.splice(j, 1);
              j--
            }
          }
        }
      }
    }
    var listmy = listAll.data.data.merchant;//请求回来得函数
    for (var p = 0; p < listmy.length; p++) {
      // debugger;
      var listChid = listmy[p].discountModelList;
      listmy[p].distance = parseInt(listmy[p].distance);
      for (var u = 0; u < listChid.length; u++) {
        if (listChid[u].type == 0) {
          listChid[u].nathingName = '打折优惠'
        } else if (listChid[u].type == 1) {
          listChid[u].nathingName = '满' + listChid[u].full + '减' + listChid[u].reduce;
        } else if (listChid[u].type == 2) {
          listChid[u].nathingName = '支持自取'
        }
      }
    }
    var NewList = that.data.shopList;//空数组
    NewList.push.apply(NewList, listmy);
    that.setData({
      shopList: NewList
    })
    console.log(that.data.shopList);
  },
  querydis:function () {//下拉刷新函数
    const that = this;
    page++
    that.downPart(page)
    wx.showToast({
      title: '稍等',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
  },
  onReachBottom: function () {
    console.log("加载更多");
    this.setData({
      loadtType: true
    })
    this.querydis();//后台获取新数据并追加渲染
  },
  upPart () {//查询首页上的广告和推送
    var that = this;
    service.request('upPart', { longitude: that.data.longitude, latitude:that.data.latitude}).then((res) => {
      console.log(res);
      that.setData({
        noticeMessg: res.data.data.notice,
        quality: res.data.data.merchant,
        navImg: res.data.data.advertise
      })
      console.log(res)
    })
  },
  queryMapName () {//查询地图具体地址
    // debugger;
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function (addressRes) {
            console.log(addressRes);
            that.setData({
              mapName: addressRes.result.formatted_addresses.recommend
            });
            that.downPart(page);
            that.upPart();
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
      fail:function(res) {
        console.log(res);
        wx.getSetting({
          success(res) {
            console.log(res);
            if (!res.authSetting["scope.userLocation"]) {
              that.showRemind();
            }
          }
        })
      }
    });
  },
  openSetting:function() {//取消选择后的操作
    var that = this;
    wx.openSetting({
      success: (res) => {
        console.log(res);
        if (!res.authSetting['scope.userLocation']) {
          that.queryMapName();
        }
      }, fail: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          that.queryMapName();
        }
      }
    })
  },
  showRemind:function() {
    var that = this;
    wx.showModal({
      title: '温馨提醒',
      content: '需要获取您的地理位置才能使用小程序',
      showCancel: false,
      confirmText: '获取位置',
      success: function (res) {
        if (res.confirm) {
          that.openSetting();
        }
      }, fail: (res) => {
        that.openSetting();
      }
    })
  },
  map () {//重新选择地图位置
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          mapName: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.upPart();
        that.setData({
          shopList: []
        })
        page = 1;
        that.downPart(page);
      },
    })
  },

  goshoping:function() {
    var userid = app.globalData.userData.id;
    wx.navigateTo({
      url: '/pages/shoppingCar/shoppingCar?' + 'userid=' + userid ,
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tapName(event) {
    console.log(event)
  },

  onReady () {
    
  },

  onShow () {
    console.log(this.route);
    
  },


  onLoad: function (options) {
    // debugger;
    var that = this;
    that.queryMapName();
    var login = app.globalData.userData;
    if (login == null) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    // wx.navigateTo({
    //   url: '/pages/login/login',
    // })
    var two = 5 - that.data.num;
    that.setData({
      one_1: that.data.num,
      two_1: 5 - that.data.num
    })
    //初始化地图
    qqmapsdk = new QQMapWX ({
      key:'SJYBZ-B6VH5-BKOIZ-QTJRE-F6NQ2-BNF37'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onHide:function () {
    
  },
  onPageScroll: function (e) {
    console.log(e);//{scrollTop:99}
  },
  onPullDownRefresh:function() {//下拉刷新假象
    console.log('下拉刷新')
    wx.showNavigationBarLoading()
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
