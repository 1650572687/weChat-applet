// pages/auth/index.js
import {request} from '../../request/index'
import {login} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  async handlerGetUserInfo(e){
    //获取用户信息
    console.log('用户信息的返回值是==',e)
    //暂存用户信息 作为请求token的参数
    const {encryptedData,rawData,iv,signature} = e.detail

    const {code} = await login();
    console.log('code是=',code)

    const loginParams = {encryptedData,rawData,iv,signature,code}
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin',
      data:loginParams,
      method:"post"
    }).then(res => {
      console.log('结果是=====',res)
      //企业id 可以获取token
      let {token} = res
      token = 'jiashujv---ASKDHJKASDHJKHASKJDHAJKLSDHKJASHDJKASHD'
      //存储token操作，同时跳转回上一页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      });
        

    })
  }
})