// pages/shopDetails/shopDetails.js
const app = getApp()
const service = require('../../utils/myapi.js');
var arrFlaw = [];//瑕疵的数组
Page({

  /**
   * 页面的初始数据e
   */
  data: {
    pageNum:1,//评论页数
    userid:null,//用户id
    shopid:null,//商户id
    shopAllList:null,//跳转到单个商品该商家的所有东西
    evaluateSize:0,//评论的条数
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 500, //可以控制动画
    list: '',
    one_1:5,
    two_1:0,
    second_height:0,
    detail: [],//商品数组
    indexFlaw:null,//瑕疵的初始值
    navbarActiveIndex:0,//导航和下面商品的联动
    navbarTitle:[//导航名称
      "下单",
      "评价",
      "商家"
    ],
    flawList:[
      {id:1,name:'不明污渍',checed:false},
      { id: 1, name: '破洞', checed: false },
      { id: 2, name: '掉色', checed: false},
      { id: 3, name: '血渍', checed: false},
      { id: 4, name: '笔印', checed: false},
      { id: 5, name: '串色', checed: false},
      { id: 6, name: '破洞', checed: false},
      { id: 7, name: '少扣', checed: false},
      { id: 8, name: '掉毛', checed: false},
      { id: 9, name: '变形', checed: false},
      { id: 10, name: '起球', checed: false},
      { id: 11, name: '起泡', checed: false},
      { id: 12, name: '挂毛', checed: false},
      { id: 13, name: '泛黄', checed: false},
      { id: 14, name: '磨损', checed: false},
      { id: 15, name: '霉斑', checed: false},
      { id: 16, name: '油漆', checed: false},
      { id: 17, name: '织补', checed: false},
      { id: 18, name: '烫伤', checed: false},
    ],
    shopName:null,//商家除了不是营业中的所有状态
    scrollType:true,//纵向滚动
    singleShop:null,//单个商品的所有信息
    singleId:null,//单个商品的id
    singleName:'',//单个商品的名字
    custom:null,//其他备注信息内容
    remark:null,//备注
    addvange:false,//控制模态框出现
    shopCarList:[],//购物车内的所有商品
    num:1,//单个商品数量底部购物车
    numShop:1,//选取商品的数量。中间
    shopAllPrice:null,//选取商品后的总价格
    showType:false,//显示或者隐藏选取商品
    Evalue:[],//评论数组
    loadtType:false,//load加载
    loadNanme: '努力加载更多...',//loading的名字
    imgType:true,//没有数据时得图
    allNum:null,//订单衣物得总
    allMoneyShop:null,//订单衣物得总数量
  },
  onNavBarTap(e) {//页面上部导航条的点击跳转
  var that = that;
    let navBarIndex = e.currentTarget.dataset.navbarIndex;
    this.setData({
      navbarActiveIndex: navBarIndex
    })
  },
  onBindAnimationFinish(detail) {//导航下部内容滑动
    console.log(detail)
    this.setData({
      navbarActiveIndex:detail.detail.current
    })
  },
  evaluate:function() {//查询商户的评论
    service.request('findByEvaluate')
  },
  shopQuery(e) {//商品点击事件
    console.log(e);
  },
  selectShop:function (e) {//点击单个商品的参数
    console.log(e)
    var that = this;
    var Type = that.data.showType;
    var status = that.data.shopAllList.status;
    if(status == 0) {
      that.setData({
        singleShop: e.currentTarget.dataset.index,
        shopAllPrice: e.currentTarget.dataset.index.price,
        showType: (!Type),
        singleId: e.currentTarget.id,
        singleName: e.currentTarget.dataset.shopname
      })
    }else if (status == 1){
      wx.showToast({
        title: '商家已休息',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }else if(status == 2) {
      wx.showToast({
        title: '商家已下架',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  },
  change(e) {//商品导航下拉指定位置
    this.setData({
      indexSize: e.detail.current
    })
    console.log(e)
  },
  scrollTo(e) {
    this.setData({
      indexSize: e.target.dataset.index
    })
    console.log(e)
  },
  queryShopChild:function () {//查询详细商品
    var that = this;
    service.request('findByMerchatChidId',{merchantid:that.data.shopid,userid:that.data.userid}).then((res)=>{
      console.log(res);
      var typeList = res.data.data.type;
      var listShop = res.data.data.merchant;
      var size = res.data.data.evaluateSize;//评论条数
      listShop.sumScore = listShop.sumScore.toFixed(1)
      app.globalData.commercial =listShop
      if (app.globalData.commercial.status == 1) {
        that.setData({
          shopName: '商家休息中'
        })
      } else if (app.globalData.commercial.status == 2) {
        that.setData({
          shopName: '商家已下架'
        })
      }
      that.setData({
        detail:typeList,
        shopAllList:listShop,
        evaluateSize: size,
      })
      that.pushString(typeList);
    })
  },
  shopList:function (e) {//点击图片出现商品列表
    var that =this;
    var num = that.data.shopCarList.length;
    if(num !== 0) {
      that.setData({
        addvange: (!that.data.addvange)
      })
    }
  },
  modalHiden:function() {//点击其他位置模态框消失
    this.setData({
      addvange:(!this.data.addvange)
    })
  },
  showAddShop:function () {//点击其他位置隐藏选取商品模态框
    var that = this;
    var price = that.data.singleShop.price;
    that.setData({
      showType:(!that.data.showType),
      numShop:1,
      shopAllPrice: price
    })
    var list =that.data.flawList;
    for(var i = 0;i<list.length;i++) {
      var type = 'flawList['+ i +'].checed'
      this.setData({
        [type]:false
      })
    }
  },
  showChid:function() {//内部内容不会隐藏
    this.setData({
      showType:this.data.showType
    })
  },
  modeChid:function (e) {//控制点击弹框内容不隐藏框
    console.log(e);
    this.setData({
      addvange:true
    })
  },
  cleanAll:function(e) {//删除全部所选商品
    console.log(e);
    var that = this;
    var arr = [];
    var list = e.currentTarget.dataset.item;
    for(let i=0;i<list.length;i++) {
      var chid = list[i].id;
      arr.push(chid);
    }
    var StrId = arr.join(',');
    console.log(StrId);
    service.request('deletShopping',{shoppingCarId:StrId,userid:that.data.userid}).then((res)=>{
      console.log(res);
      that.findShopCar();
    })
  },
  moveNumShop () {//选取商品数量减商品中部
    var newNum = this.data.numShop;
    var shopPrice = this.data.singleShop.price
    newNum--
    if (newNum <= 1) {
      newNum = 1;
    }
    var nweShopPrice = (shopPrice * newNum )

    this.setData({
      numShop: newNum,
      shopAllPrice:nweShopPrice
    })
    that.upCar();
  },
  pushNumShop: function () {//点击增加商品数量中部
    var newNum = this.data.numShop;
    var shopPrice = this.data.singleShop.price
    newNum++;
    var nweShopPrice = (newNum * shopPrice);
    console.log(nweShopPrice);
    this.setData({
      numShop: newNum,
      shopAllPrice: nweShopPrice
    })
    that.upCar();
  },
  bindTextAreaBlur:function(e) {//其他备注信息的内容
    // console.log(e.detail.value);
    this.setData({
      custom:e.detail.value
    })
  },
  moveNum:function (e) {//点击减少商品数量
    console.log(e)
    var that = this;
    var shopALLCar = that.data.shopCarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = shopALLCar[listId].number;
    var shopId = e.currentTarget.dataset.shopid;
    if (listChildNum == 1) {
      service.request('deletShopping', { shoppingCarId: shopId, userid: that.data.userid }).then((res) => {
        if (res.data.retCode == 200) {
          that.findShopCar();
        }
      })
    }else if(listChildNum>1) {
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
  pushNum:function (e) {//点击增加商品数量
    console.log(e)
    var that = this;
    var shopALLCar = that.data.shopCarList;
    var listId = e.currentTarget.dataset.id;
    var listChildNum = shopALLCar[listId].number;
    var shopId = e.currentTarget.dataset.shopid;
    listChildNum++;
    var reallyNum = 'shopALLCar[" + listId +"].number'
    shopALLCar.forEach((item,index,arr)=>{
      var sItem = "shopCarList["+ index +"].number";
      console.log(sItem);
      if(index == listId) {
        that.setData({
          [sItem]: listChildNum
        });
        service.request('shoppingCar', { userid: that.data.userid, symbol: "%2B", shopid: shopId}).then((res)=>{
          console.log(res);
          if(res.data.retCode) {
            that.findShopCar();
          }
        })
      }
    })
    
    console.log(listChildNum,shopALLCar);
  },
  findShopCar:function() {//查询购物车所有商品
    // debugger;
    var that = this;
    service.request('findByShopCarAll',{userid:that.data.userid,status:'0'}).then((res)=>{
      console.log(res);
      var resList = res.data.data;
      console.log(resList);
      var list = [];
      for(var i = 0;i<resList.length;i++) {
        var listChid = resList[i].data;
        list.push.apply(list,listChid);
      }
      console.log(list);
      var listLength = list.length;
      var allNum=0;
      var allMoney=0;
      for(var w=0;w<list.length;w++) {
        var money = list[w].price * list[w].number;
        allNum+=list[w].number;
        allMoney+= money;
        console.log(allNum,allMoney)
      }
      that.setData({
        shopCarList:list,
        num:listLength,
        allNum: allNum,
        allMoneyShop: allMoney
      })
    })
  },
  queryOneShop:function() {
    var that = this;
    service.request('shoppingCarStatus', { userid: that.data.userid, commodityid: that.data.singleId,}).then((res)=>{
      console.log(res);
    })
  },
  upCar:function() {//添加商品进购物车
    var  that = this;
    var upFlaw = [];//瑕疵数组
    var list = that.data.flawList;
    for(var i =0;i<list.length;i++) {
      var chidList = list[i];
      if(chidList.checed) {
        upFlaw.push(chidList.name);
      }
    }
    var remark = upFlaw.join(',');
    this.setData({
      remark: remark
    })
    // console.log(upFlaw.join(','));
    service.request('addshopCar', { userid: that.data.userid, merchantid: that.data.shopid, commodityid: that.data.singleId, commodityName: that.data.singleName,number:that.data.numShop,remark:that.data.remark,custom:that.data.custom}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200) {
        // showType
        that.setData({
          showType:(!that.data.showType)
        })
        that.findShopCar();
        that.queryOneShop();
      }
    })
  },
  callPhone:function() {//商家详情拨打电话
    var that =this
    var phone = that.data.shopAllList.phone
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  queryShopMessage:function() {
    var that =this;
    const archid = that.data.shopAllList.archivesid
    service.request('findByArchivesId', { archivesid:archid}).then((res)=>{
      console.log(res);
    })
  },
  queryEvalue:function() {//查询商户评论
    var that = this;
    service.request('queryEvaluate', { merchantid: that.data.shopid, pageNum: that.data.pageNum}).then((res)=>{
      console.log(res);
      if(!res.data.data) {
        that.setData({
          imgType:true
        })
      }
      var list = res.data.data;
      console.log(list);
      // debugger;
      for(var i=0;i<list.length;i++) {
        var num = Number(list[i].score)
        var newNUm = parseInt(num); 
        list[i].score = newNUm;
        console.log(list[i].score)
        var listImg = list[i].img
        if(listImg) {
          var newImg = listImg.split(',');
          list[i].img = newImg;
          console.log(list);
        }
        var a =list[i].name;
        var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
        if(regx.test(a)) {
          // console.log('这是电话号码')
          var NewName = a.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          // console.log(NewName);
          list[i].name = NewName;
        }

      }
      var newList = that.data.Evalue;
      newList.push.apply(newList,list) 
      console.log(newList);
      if(res.data.retCode == 200) {
        that.setData({
          Evalue: newList
        })
        if(!res.data.data.length) {
          that.setData({
            loadNanme:'加载完成'
          })
        }
      }
    })
  },
  GoShoppingCar:function() {
    var that = this;
    var allNum = that.data.allNum;
    if(allNum) {
      wx.navigateTo({
        url: '/pages/shoppingCar/shoppingCar?' + 'userid=' + that.data.userid + "&shopid=" + that.data.shopid
      })
    }
  },
  dowmload:function(e) {
    console.log(e);
    var that = this;
    var num = that.data.pageNum;
    num++
    that.setData({
      loadtType:true,
      pageNum:num
    })
    that.queryEvalue();
  },
  onReachBottom: function () {//评价触底更新
    debugger;
    console.log("加载更多");
    // this.setData({
    //   loadtType: true
    // })
    // this.querydis();//后台获取新数据并追加渲染
  },
  flawCath:function(e) {
    console.log(e);
    var index = e.currentTarget.dataset.item;
    var id = e.currentTarget.dataset.index;
    var type = index.checed;
    var chel = 'flawList[' + id +'].checed'
    this.setData({
      indexFlaw:(!type),
      [chel]:(!type)
    })
    console.log(this.data.flawList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      userid:options.userid,
      shopid:options.shopid
    })
    that.findShopCar();
    that.queryShopChild();
    this.queryEvalue();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight -res.windowWidth / 750 * 416
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
    this.findShopCar();
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