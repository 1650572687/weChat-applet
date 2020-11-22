// pages/cart/index.js
import {getSetting,openSetting,getChoseAddress} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},//缓存中的收货地址信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取地址点击事件
  async handlerGetAddress(){
    //使用 try catch 进行错误提示
    //真机的时候  新版本已经不判断是否授权，新版本已经默认授权了
    //获取地址的时候 先判断是否有权限 权限为 true 或者undefined可以直接打开获取地址api，权限为false需要wx-openSetting重新设置获取地址权限后才能打开wx-choseAddress
    try{
      let res1 = await getSetting();//获取地址权限
      let scopeAddress = res1.authSetting['scope.address']
      console.log('现在的权限信息是===',scopeAddress)
  
      if(scopeAddress === true || scopeAddress === undefined){
      }else{
        await openSetting();
      }
      let AddressData = await getChoseAddress()
      AddressData.all = AddressData.provinceName + AddressData.cityName + AddressData.countyName + AddressData.detailInfo
      console.log('现在的地址信息是===',AddressData)
      wx.setStorageSync('address', AddressData);
        
    }catch(error){
      console.log('error====',error)
    } 

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
    let address = wx.getStorageSync('address');
    this.setData({
      address
    })
      
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