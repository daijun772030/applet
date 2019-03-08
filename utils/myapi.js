const Promise = require('es6-promise.min.js');
const baseUrl = 'http://39.108.113.149:8081/'
function jsonToString (json) {
  var str =[];
  for(var i in json) {
    str.push(i + '=' + json[i]);
  }
  return str.join('&');
}
function wxPromise(method,url,data,...config) {
  return new Promise(function(resolve,reject) {
    wx.request({
      url: baseUrl + url,
      method:method,
      data:data,
      header:{
        'Content-Type': "application/json"
      },
      success:function(res) {
        // console.log('进入请求')
        // console.log(res);
        resolve(res);
        // if(res.data.retCode == '200') {
        //   resolve(res)
        // }else{
        //   resolve(res.data);
        // }
      },
      fail:function(res) {
        console.log(res);
      }
    });
  }
  )
}
  const get = (url) =>{
    return (data) => {
      return (config) =>{
        return wxPromise('GET', url ,data,config)
      }
    }
  };
const post = (url) => {
  return (data) => {
    return (config) => {
      if(data) {
        let myUrl = url.split("?");
        data = jsonToString(data);
        url = myUrl[0] + "?" + data;
        console.log(url)
      }
      console.log(data,url);
      return wxPromise('POST',url,data,config)
    }
  }
},

// 接口map 表
 apis = {
   //首页方法
   //首页上部广告
   upPart:post('index/upPart'),
   //首页底部商户信息
   downPart:post('index/downPart'),
   //登录方法
   sendSms: get('user/sendSms'),//发送验证码
   loginCode: post('user/loginCode'),//验证码登录
   loginPwd:post('user/loginPwd'),//密码登录
   findByMerchatChidId: get('merchant/findByUseridMerchantid')//点击商铺进去选商品
}

function request (name,data,config) {
  return apis[name](data)(config);
}
module.exports = {
  request:request
}