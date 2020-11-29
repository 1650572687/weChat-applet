// pages/login/index.js
Page({
  //获取用户信息
  handlerGetUserInfo(e){
    console.log('获取用户信息===',e)

    let {userInfo} = e.detail

    //将用户数据添加至缓存中
    wx.setStorageSync('userinfo', userInfo);

    wx.navigateBack({
      delta: 1
    });
      
  }
})