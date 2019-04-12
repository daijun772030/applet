// pages/payOrder/payOrder.js
const app = getApp()
const service = require('../../utils/myapi.js')
const MD5 = require('../../utils/MD5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '达达配送', value: '0',checked: 'true' },
      { name: '自取自送', value: '1' },
    ],
    checkbox:[
      {name:'lazyRed',value:'1',checked:true},
      { name: 'takeoff', value: '2', checked: true },
      { name: 'money', value: '3', checked: true },
    ],
    startime:null,//取件时间
    endtime:null,//送件时间
    iftake:0,//配送方式，0达达1自取
    userid:null,//用户id
    shopid:null,//商户id
    Carid:[],//购物车id集合
    CarOrder:null,//查询订单返回的数据
    Distance:[],//收货地址集合
    takeoff:0,//取送费
    disableType:false,//地址模块出现
    defaultDistance:null,//默认收货地址
    DistanceType:false,//模态框的出现和隐藏
    timeType:false,//选择取件时间type
    navbarActiveIndex:0,//选中的时间index初始值
    yearStrin:null,//选中的时间年份
    yourString:null,//选中的取件时间的毫秒
    immediately:null,//0为不是立即取件。一为立即取件
    year:[],//取件得日期
    your: [],//取件得时刻当天的
    yours:[],//往后其他的几天的取件时间
    qujian:[],//真正渲染的取件小时数
    rwoNal:true,//立即取件
  },
  yhAllMoney:null,//优惠的总合计
  payAllMoney:null,//支付的总money
  wallet:null,//钱包需要扣除的钱
  lazyRed:0,//懒猪红包
  takoffRed:0,//取送券
  /*页面事件 */
  dada:function(e) {//取消优惠按钮函数
    console.log(e);
    // debugger;
    var list = e.currentTarget.dataset.item.value;
    for(var i = 0;i<this.data.checkbox.length;i++) {
      var check = this.data.checkbox[i].checked
      var value = this.data.checkbox[i].value;
      if(list == value) {
        var arr = "checkbox[" + i + "].checked"
        this.setData({
          [arr]: (!check)
        })
      }
      console.log(this.data.checkbox)
    }
    var carList = this.data.CarOrder;
    //取消按钮的操作
    // debugger;
    var redmoney = 0;//红包
    var lazyTakeoff = null;//取送费
    var wallet = 0;//钱包
    var yhAll = 0;//优惠合计
    var payALL = 0;//支付合计
    var carList = this.data.CarOrder;
    for (var x = 0; x < this.data.checkbox.length; x++) {
      var list = this.data.checkbox[x];
      if (list.checked) {
        if (list.value == 1) {
          redmoney = carList.red
        } else if (list.value == 2) {
          if(this.data.iftake==1) {
            lazyTakeoff=0
          }else {
            lazyTakeoff = carList.DeliveryRed
          }
        } else if (list.value == 3) {
          var zijMoney = carList.count + this.data.takeoff - carList.reduce - redmoney - lazyTakeoff
          if (carList.wallet >= zijMoney) {
            if(zijMoney<0) {
              wallet=0;
            }else {
              wallet = carList.count + this.data.takeoff - carList.reduce - redmoney - lazyTakeoff - 0.01
            }
          }else{
            wallet = carList.wallet
          }
        }
      } else {
        if (list.value == 1) {
          redmoney = 0
        } else if (list.value == 2) {
          lazyTakeoff = 0
        } else if (list.value == 3) {
          wallet = 0
        }
      }
    }
    console.log(redmoney, lazyTakeoff)
    yhAll = redmoney + lazyTakeoff + carList.reduce + wallet
    var payTak = carList.count + this.data.takeoff
    if (payTak>yhAll) {
      payALL =payTak - yhAll 
    }else if(payTak<yhAll){
      payALL = yhAll -payTak
    }else {
      payALL = payTak - yhAll
    }
    this.setData({
      yhAllMoney: yhAll.toFixed(2),
      payAllMoney: payALL.toFixed(2),
      wallet: wallet,
      lazyRed: redmoney,//懒猪红包
      takoffRed: lazyTakeoff,//取送券
    })
  },

  radioChange:function (e) {//取送方式
  // debugger;
    console.log(e.detail.value);
    this.setData({
      iftake:e.detail.value
    })
    for (let i = 0; i <this.data.checkbox.length;i++) {
      var typeC = "checkbox[" + i + "].checked"
      this.setData({
        [typeC]:true,
        
      })
    }
    var takeoff = this.data.takeoff
    if(e.detail.value == 1) {
      var cke = "checkbox[1].checked"
      this.setData({
        takeoff:0,
        [cke]:false,
      })
      this.money();
    }else {
      const that = this;
      var cke = "checkbox[1].checked"
      that.setData({
        [cke]: true,
        // takoffRed: that.data.CarOrder.DeliveryRed
      })
      that.qeryDistance();
      setTimeout(function () {
        that.money()
      }, 2000)
    }
  },
  checkboxChange:function(e) {//选取优惠的列表
    console.log(e);
    var value = e.detail.value;
    var list = e.currentTarget.dataset.list;
    // for()
  },
  quryOrder:function() {//获取本页面得基本数据
    var that =this;
    var id = that.data.Carid
    var newID=id.join(',')
    console.log(id);
    service.request('subminssion', { userid: that.data.userid, merchantid: that.data.shopid, shopId: newID}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200 && res.data.data!=null) {
        that.setData({
          CarOrder:res.data.data
        })
        console.log(that.data.CarOrder)
      }
    })
  },
  queryAddress:function() {//点击出现地址选择框
    this.setData({
      DistanceType:true,
      disableType:true,
      timeType:false
    })
  },
  queryTime:function() {//点击出现选择时间
    this.setData({
      DistanceType: true,
      timeType: true,
      disableType: false,
    })
    var startTime = null;
    var endTime = null;
    if (this.data.CarOrder.startTime == null || this.data.CarOrder.endTime == null) {
      startTime = '09';
      endTime="18";
    }else {
      startTime = this.data.CarOrder.startTime.split(":")[0];
      endTime = this.data.CarOrder.endTime.split(":")[0];
    }
    console.log(endTime,startTime);
    var index = endTime - startTime - 1;
    var yoursDate = [];//当天的取件时间
    var nathingDate=[];//其他天的取件时间
    var d = new Date();
    var xish = d.getHours();
    var datetime = xish + ':' + d.getMinutes() + ':' + d.getSeconds();
    var dateYear = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var dat = dateYear.replace(/-/g, '/') + " " + datetime;
    console.log(dateYear,datetime);
    console.log(Date.parse(dat));
    for(var j = 0;j<index;j++) {//得到商家的营业时间
      var newtime = (parseInt(startTime) + 1 + parseInt(j)) + ":00:00"//营业时间往后推了一个小时
      var ShopTime = (parseInt(startTime) + parseInt(j)) + ":00:00"//正常的营业时间
      var newDt = dateYear.replace(/-/g, '/') + " " +  newtime

      console.log(newDt)
      var num = Date.parse(newDt);
      var numt = Date.parse(dat);
      console.log(num,numt);
      nathingDate.push(newtime)
      if(num>numt) {
        yoursDate.push(newtime)
      }
    }
    console.log(yoursDate);

    var newDate = [];
    

    for(var i =0; i<10;i++) {
      newDate.push(this.GetDateStr(i))
    };
    console.log(newDate);
    this.setData({
      year:newDate,
      your:yoursDate,
      yours: nathingDate,
      qujian: yoursDate,
      yearStrin:newDate[0]
    })

  },
   GetDateStr:function(AddDayCount) {//获取当前时间的往后十天
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    return y + "-" + m + "-" + d;
  },
  showAddShop:function () {//点击外层模态框消失
    this.setData({
      DistanceType: false,
      navbarActiveIndex:0,
      rwoNal:true,
    })
  },
  address:function() {//点击模态框内容部分不隐藏
    this.setData({
      DistanceType: true,
    })
  },
  setYear:function(e) {//选择取件时间的日期
    console.log(e);
    var that = this;
    var index = e.currentTarget.dataset.index;
    var year = e.currentTarget.dataset.year
    that.setData({
      navbarActiveIndex:index,
      yearStrin:year
    })
    var your =that.data.your;
    var newYour = that.data.yours;
    if(index!=0) {
      that.setData({
        qujian: newYour,
        rwoNal:false,
      })
    }else {
      that.setData({
        qujian: your,
        rwoNal:true,
      })
    }
  },
  setYour:function(e) {//选取时分秒的时间
    console.log(e);
    var that = this;
    var your = e.currentTarget.dataset.your
    that.setData({
      yourString: your,
      DistanceType:false,
      immediately:0
    })

    that.payTime();
  },
  
  qeryDistance:function() {//查询用户的所有地址
    var that =this;
    // debugger;
    service.request('allByDistance',{merchantid:that.data.shopid,userid:that.data.userid}).then((res)=>{
      console.log(res);
      if(res.data.retCode == 200 && res.data.data.addressList!=null) {
        that.setData({
          takeoff:res.data.data.takeoff,
          Distance:res.data.data.addressList
        })
        var DistanceList = that.data.Distance;
        for (var i = 0; i < DistanceList.length; i++) {
          // debugger;
          var chid = DistanceList[i];
          if (chid.ifSelect == 1) {
            that.setData({
              defaultDistance: chid
            })
          }
        }
        // setTimeout(function() {
        //   that.money();
        // },2000)
      }else {
        that.setData({
          takeoff:0
        })
      }
    })
  },
  money:function() {//换算金额
    var that = this;
    // debugger;
    // debugger;
    if (that.data.Distance == null || that.data.defaultDistance==null) {
      that.setData({
        takeoff:0
      })
    }
    var dRed,layRed;
    var takeoff = Number(that.data.takeoff);
    var carList = that.data.CarOrder;
    var wallet = carList.wallet;//钱包总金额
    for(let i=0;i<that.data.checkbox.length;i++) {
      let type = that.data.checkbox[i].checked;
      if(type) {
        if(i==0) {
          layRed = carList.red
        }else if(i==1) {
          dRed = carList.DeliveryRed;
        }
      }else {
        if (i == 0) {
          layRed = 0
        } else if (i == 1) {
          dRed = 0;
        }
      }
    }
    var yh = carList.reduce + dRed + layRed;//优惠券加上打折的总金额
    var shopPayMoney = carList.count + takeoff;//商品总金额加上运费一起的
    var yhallMoney = null //优惠的总金额
    var payAllMoney = null;//实际需要支付的金额
    var nathingWallet = 0;//真正的钱包数量
    if (wallet!=null) {
      if (wallet < (shopPayMoney - yh)) {
        // debugger;
        // nathingWallet = wallet;
        yhallMoney = yh + wallet;
        var tfMoney = shopPayMoney - yh - wallet
        payAllMoney = tfMoney.toFixed(2);

      } else if (wallet > (shopPayMoney - yh)) {
        yhallMoney = (shopPayMoney - 0.01);
        payAllMoney = 0.01;
        if(shopPayMoney - yh>0) {
          wallet = shopPayMoney - yh - 0.01
        } else{
          wallet=0
          yhallMoney = carList.reduce + dRed + layRed
        }
        
      }
    }
    that.setData({
      yhAllMoney: yhallMoney,
      payAllMoney: payAllMoney,
      wallet: wallet,
      lazyRed: layRed,//懒猪红包
      takoffRed: dRed,//取送券
    })
    console.log(carList, wallet, yh, shopPayMoney, that.data.yhAllMoney, that.data.payAllMoney);
  },
  goUpAdd:function(e) {//跳转新添加地址编辑地址
    console.log(e);
    app.globalData.addressList = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/upAddress/upAddress?userid=' + this.data.userid
    })
  },
  upAddress:function() {//新添加地址
    app.globalData.addressList =[];
    wx.navigateTo({
      url: '/pages/upAddress/upAddress?userid=' + this.data.userid
    })
  },
  changeAddress:function(e) {//设置选择的地址为送件地址
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.item.id;
    var userid = e.currentTarget.dataset.item.userid;
    service.request('setDistance',{id:id,userid:userid,merchantid:that.data.shopid}).then((res)=>{
      console.log(res);
      if(res.data.retCode ==200) {
        that.qeryDistance();
        this.setData({
          DistanceType:false,
          timeType:false,
          disableType:false
        });
      }
    })
  },
  nowTiem:function () {//立即取件函数
    var startime = this.getDay(0);
    var endtime  = this.getDay(3);
    console.log(startime,endtime);
    this.setData({
      startime:startime,
      endtime:endtime,
      DistanceType: false,
      timeType: false,
      disableType: false,
      immediately: 1
    })
  },
   getDay:function(day){//获取当前当天的字段
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //这个关键
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    var hours = today.getHours();
    var min = today.getMinutes();
    var send = today.getSeconds();
     console.log(tMonth)
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate + ' ' + hours + ':' + min + ':' + send;
  },

  doHandleMonth:function(month) {//往后三天
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  qitashijian:function(now,day) {//选取其他的时间的后三天转化
    var a = now.replace(/-/g, '/');
    var adta1 = new Date(a)
    console.log(adta1);
    var targetday_milliseconds = adta1.getTime() + 1000 * 60 * 60 * 24 * day;
    adta1.setTime(targetday_milliseconds); //这个关键
    var tYear = adta1.getFullYear();
    var tMonth = adta1.getMonth();
    var tDate = adta1.getDate();
    var hours = adta1.getHours();
    var min = adta1.getMinutes();
    var send = adta1.getSeconds();
    console.log(tMonth)
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate + ' ' + hours + ':' + min + '0' + ':' + send + '0';
  }, 
  payTime:function() {
    var that = this;
    var newTime = that.data.yearStrin + ' ' + that.data.yourString;
    console.log(newTime);
    var startTime = that.qitashijian(newTime,0);
    var endTime = that.qitashijian(newTime,3);
    console.log(startTime,endTime);
    this.setData({
      startime:startTime,
      endtime:endTime
    })
  },
  //微信支付方法
  UpWechat:function() {//微信支付方法
    var that = this;
    var oppenid = wx.getStorageSync('oppenid');//用户得oppenid
    console.log(oppenid);
    var item = that.data.CarOrder;
    var id = that.data.Carid
    var newID = id.join(',')
    var money = that.data.payAllMoney * 100;
    console.log(money);
    var jsonObj = {//需要传递的json参数对象
      userid:that.data.userid,
      merchantid:that.data.shopid,
      shoppingid: newID,
      startTime:that.data.startime,
      endTime:that.data.endtime,
      addressid: that.data.defaultDistance.id,
      couponid:item.DeliveryRedId, 
      redid: item.redId,
      discountMoney:that.data.CarOrder.reduce,//打折优惠的钱要传
      walletPay:that.data.wallet,//钱包减了多少钱
      money: that.data.payAllMoney, 
      fee: that.data.takeoff,
      actualMoney: item.count, 
      payMethod: 0,
      id: 0, 
      iftake: that.data.iftake
    }
    var ifhave= 1;//代表小程序支付
    var newJson = encodeURIComponent(JSON.stringify(jsonObj));
    var subject = "懒猪到家-" + item.shopName + '的订单'
    if (that.data.startime && that.data.endtime && that.data.defaultDistance.id) {//选择了时间取送地址才能跳转
      service.request('wxPay', { openid: oppenid, money: money, subject: subject, jsonObject: newJson }).then((res) => {//对微信支付进行订单创建
        console.log(res);
        var data = res.data.data;
        wx.requestPayment(//调起微信支付
          {
            'appId': data.appId,
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': "MD5",
            'paySign': data.paySign,
            'success': function (res) {
              console.log(res);
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
                mask: true,
              })
              wx.switchTab({
                url: '/pages/index/index',
              })
            },
            'fail': function (res) {
              console.log(res);
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1500,
                mask: true,
              })
            },
            'complete': function (res) {
              console.log(res);
            }
          })
      })
    } else if (that.data.startime == null || that.data.endtime==null ) {
      wx.showToast({
        title: '请选择取送时间',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    } else if (that.data.defaultDistance.id == null) {
      wx.showToast({
        title: '请选择取送地址',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    console.log(options);
    console.log(app.globalData.shopUpId)
    that.setData({
      userid:options.userid,
      shopid:options.shopid,
      Carid: app.globalData.shopUpId
    });
    that.qitashijian();
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
    var that =this;
    that.quryOrder();
    that.qeryDistance();
    setTimeout(function() {
      that.money()
    },2000)
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