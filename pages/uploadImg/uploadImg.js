// pages/uploadImg/uploadImg.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
const app = getApp()
const service = require('../../utils/myapi.js')
var listall = [];//图片的集合
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:null,//用户的评价内容
    imgoll:[],//评论的图片集合
    gradeNum:0,//评价的分数
    type:false,//评论星星的图片转化
    num: [//默认未选择的展示图片的展示数量
      { checked: false, imgName:'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/huixing@2x.png'},
      { checked: false, imgName: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/huixing@2x.png' },
      { checked: false, imgName: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/huixing@2x.png' },
      { checked: false, imgName: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/huixing@2x.png' },
      { checked: false, imgName: 'cloud://sjkj-1-2739cc.736a-sjkj-1-2739cc/img/index/huixing@2x.png' },
    ],
    shopList:null,//需要评价的商店内容集合
    userid:null,//用户的id
  },
  //页面点击事件函数
  grademun:function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(e);
    var numList = that.data.num;//渲染图片的函数
    var checkType = numList[index].checked;
    for(let i=0;i<numList.length;i++) {
      var chidNum = numList[i];
      var type = "num[" + index + "].checked"
      this.setData({
        [type]: (!checkType)
      })
    }
    that.grad();
  },
  dowmImg:function() {//获取上传图片的数组
    var that = this;
    wx.chooseImage({
      count:3,
      success(res) {
        console.log(res);
        var patharr = res.tempFilePaths;
        for(let i=0;i<patharr.length;i++) {
          listall.push(patharr[i])
        }
        // if (listall.length > 3) {
        //   listall.length = 3
        // }
        that.setData({
          imgoll: listall
        })

        console.log(that.data.imgoll)
      },
    })
  },
  //end
  /**
   * 生命周期函数--监听页面加载
   */
  //点击事件
  uplaod:function() {
    var that = this;
    var obj = {
      userid: that.data.userid,
      merchantid: that.data.shopList.merchantid,
      socre: that.data.gradeNum,
      comment: that.data.inputValue,
      orderid: that.data.shopList.id
    }
    if (that.data.inputValue == null || that.data.inputValue.length<5) {
      wx.showToast({
        title: '内容不少于5个字~',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    } if (that.data.imgoll.length=0) {
      wx.showToast({
        title: '至少上传至少一张图片',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }

    let add = that.data.imgoll;//图片的集合
    console.log(add);
    wx.uploadFile({
      url: 'https://sjkjwhechat.pigcome.com/merchant/addEvaluateEdition', // 仅为示例，非真实的接口地址
      filePath: add[0],
      name: 'img',
      formData: obj,
      header: {
        'method': 'Post',
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        console.log(res);
        wx.showToast({
          title: '上传成功。感谢您的支持',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  inputDown:function(e) {//获取用户评论
    console.log(e);
    var value = e.detail.value;
    console.log(value.length)
    this.setData({
      inputValue:value
    })
  },
  grad:function() {//对店铺的评分
    var that = this;
    var num = that.data.num
    var arr = 0;
    for(let i=0;i<num.length;i++) {
      var type = num[i].checked;
      if(type) {
        arr++
      }
    }
    that.setData({
      gradeNum:arr
    })
  },
  //end
  onLoad: function (options) {
    var list = app.globalData.gradeList;
    var userid = app.globalData.userData.id;
    this.setData({
      shopList:list,
      userid:userid
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