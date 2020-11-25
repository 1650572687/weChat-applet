// pages/cart/index.js
import {getSetting,openSetting,getChoseAddress} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},//缓存中的收货地址信息
    cart:[],//缓存中 的购物车信息
    totalPrice:0,//结算商品总价
    totalNum:0,//结算商品总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //获取地址
    let address = wx.getStorageSync('address');
    //获取缓存中的信息
    let cart = wx.getStorageSync('cart') || [];

    //结算页面只结算 选中的商品
     cart = cart.filter(v => v.checked)
      
    // //数组方法 every() 如果是空数组的话 也会返回true
    // let allChecked = cart.length ? cart.every(v=>v.checked === true) : false

    //页面显示时计算 商品 总价 商品总数量
    let totalPrice = 0
    let totalNum = 0
    cart.map(item => {
        totalPrice += item.num * item.goods_price
        totalNum += item.num
    })

    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
      
  },
  
  //点击支付按钮
  handlerOrderPay(){ 
    //1 从缓存中获取token
    let token = wx.getStorageSync('token') || '';
    //2 判断是否有 token
    if(!token){
      //如果没有token 进入授权页面 获取token
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return
    }
    console.log('获取到的token是==',token)
  },






  //设置总价格，总数量，更新储存 data和缓存中的数据
  setCart(cart){
      //数组方法 every() 如果是空数组的话 也会返回true
      let allChecked = cart.length ? cart.every(v=>v.checked === true) : false

      //页面显示时计算 商品 总价 商品总数量
      let totalPrice = 0
      let totalNum = 0
      cart.map(item => {
        if(item.checked){ //如果是被选中的 商品 进行计算价格和数量的操作
          totalPrice += item.num * item.goods_price
          totalNum += item.num
        }
      })

      //将更新以后的数据 存储到 data 中
      this.setData({
        cart,totalPrice,totalNum,allChecked
      })

      //将更新以后的数据 重新存储到缓存种
      wx.setStorageSync('cart', cart);
  },


  
})