// pages/shopDetails/shopDetails.js
const app = getApp()
const service = require('../../utils/myapi.js')
Page({

  /**
   * 页面的初始数据e
   */
  data: {
    userid:null,//用户id
    shopid:null,//商户id
    shopAllList:null,//跳转到单个商品该商家的所有东西
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 500, //可以控制动画
    list: '',
    one_1:5,
    two_1:0,
    second_height:0,
    detail: [],//商品数组
    navbarActiveIndex:0,//导航和下面商品的联动
    navbarTitle:[//导航名称
      "下单",
      "评价",
      "商家"
    ],
    flawList:[
      {id:1,name:'不明污渍'},
      { id: 1, name: '破洞' },
      { id: 2, name: '掉色' },
      { id: 3, name: '血渍' },
      { id: 4, name: '笔印' },
      { id: 5, name: '串色' },
      { id: 6, name: '破洞' },
      { id: 7, name: '少扣' },
      { id: 8, name: '掉毛' },
      { id: 9, name: '变形' },
      { id: 10, name: '起球' },
      { id: 11, name: '起泡' },
      { id: 12, name: '挂毛' },
      { id: 13, name: '泛黄' },
      { id: 14, name: '磨损' },
      { id: 15, name: '霉斑' },
      { id: 16, name: '油漆' },
      { id: 17, name: '织补' },
      { id: 18, name: '烫伤' },
    ],
    singleShop:null,//单个商品的所有信息
    singleId:null,//单个商品的id
    singleName:'',//单个商品的名字
    remark:null,//其他备注信息内容
    addvange:false,//控制模态框出现
    shopCarList:[],//购物车内的所有商品
    num:1,//单个商品数量底部购物车
    numShop:1,//选取商品的数量。中间
    shopAllPrice:null,//选取商品后的总价格
    showType:false,//显示或者隐藏选取商品
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
    that.setData({
      singleShop: e.currentTarget.dataset.index,
      shopAllPrice: e.currentTarget.dataset.index.price,
      showType:(!Type),
      singleId: e.currentTarget.id,
      singleName:e.currentTarget.dataset.shopname
    })
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
  queryShopChild:function () {
    var that = this;
    service.request('findByMerchatChidId',{merchantid:that.data.shopid,userid:that.data.userid}).then((res)=>{
      console.log(res);
      var typeList = res.data.data.type;
      that.setData({
        detail:typeList
      })
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
      remark:e.detail.value
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
      that.setData({
        shopCarList:list,
        num:listLength
      })
    })
  },
  upCar:function() {//添加商品进购物车
    var  that = this;
    service.request('addshopCar', { userid: that.data.userid, merchantid: that.data.shopid, commodityid: that.data.singleId, commodityName: that.data.singleName,number:that.data.numShop,remark:that.data.remark}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200) {
        // showType
        that.setData({
          showType:(!that.data.showType)
        })
        that.findShopCar();
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
    service.request('queryEvaluate', { merchantid: that.data.shopid,pageNum:'1'}).then((res)=>{
      console.log(res);
    })
  },
  GoShoppingCar:function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/shoppingCar/shoppingCar?' + 'userid=' + that.data.userid + "&shopid=" + that.data.shopid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      userid:options.userid,
      shopid:options.shopid,
      shopAllList: app.globalData.commercial
    })
    that.queryShopChild();
    that.findShopCar();
    that.queryEvalue();


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