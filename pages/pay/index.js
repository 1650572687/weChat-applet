// pages/cart/index.js
import {getSetting,openSetting,getChoseAddress} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import {request} from '../../request/index'
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
  async handlerOrderPay(){ 
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
    //3 创建订单
    //3.1 准备请求头参数token
    const header = {Authorization:token}
    // console.log('获取到的token是==',token)
    //3.2 准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    //订单数组 将购物车数据 循环放入
    let goods = []
    let {cart} = this.data
    cart.forEach(item => {
      goods.push({
        goods_id:item.goods_id,
        goods_number:item.num,
        goods_price:item.goods_price
      })
    });

    let {order_number} = await this.createOrders(header,order_price,consignee_addr,goods)
    console.log('当前的订单编号是==',order_number)
    //企业账号中 此接口可以返回 wx-requestPayment 微信支付api 所需要的数据
    // let {timeStamp,nonceStr,package,signType,paySign} = await this.unifiedorder(header,order_number)
    this.unifiedorder(header,order_number)
    let aaa = await this.unifiedorder(header,order_number)
    console.log('aaa是',aaa)
    // let {timeStamp,nonceStr,package,signType,paySign} =aaa

    //支付接口
    wx.requestPayment({
      timeStamp:aaa.timeStamp,
      nonceStr:aaa.nonceStr,
      package:aaa.package,
      signType:aaa.signType,
      paySign:aaa.paySign,
      success: (result)=>{
        console.log('执行支付了吗',result)
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    // 支付成功以后 调用 查询订单接口 检查是否支付成功，此处没有公司id账号  不写此接口

    // 支付成功以后 手动删除 已经被选中支付的商品
    let newCart = wx.getStorageSync('cart');
    newCart = newCart.filter(v => !v.checked)
    wx.setStorageSync('cart', newCart);
      

  },

  //创建订单接口
  createOrders(header,order_price,consignee_addr,goods){
    return new Promise((resolve,reject) => {
      request({
        url:'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/create',
        data:{order_price,consignee_addr,goods},
        header,
        method:"post"
      }).then(res => {
        console.log('结果是=====',res)
        res.order_number = '72348923412390480238'
        resolve(res)
        // let order_number = res.order_number
        // console.log('假数据的订单编号是==',order_number)
  
      })
    })
  },

  //预支付接口
  unifiedorder(header,order_number){
    return new Promise((resolve,reject) => {
      request({
        url:'https://api-hmugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder',
        data:{order_number},
        header,
        method:"post"
      }).then(res => {
        console.log('结果是=====',res)
        // res.order_number = '72348923412390480238'
        res.timeStamp = '123123123'
        res.nonceStr = 'asdasdasdasd'
        res.package = '1231232345345'
        res.signType = 'sdklfjdfklgj'
        res.paySign = 'dfgkjdfdfgkldfg'
        // resolve(res)
        resolve(res);
        // let order_number = res.order_number
        // console.log('假数据的订单编号是==',order_number)
  
      })
    })
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