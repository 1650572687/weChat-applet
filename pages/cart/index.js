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
    allChecked:false,//从缓存中的购物车 信息判断是否全选
    totalPrice:0,//结算商品总价
    totalNum:0,//结算商品总数量
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
    //获取地址
    let address = wx.getStorageSync('address');
    //获取缓存中的信息
    let cart = wx.getStorageSync('cart') || [];
      
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

    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
      
  },

  //选中单个商品的事件
  handlerCheck(e){
    //1 获取当前选择的商品id
    let checkId = e.currentTarget.dataset.id

    //2 获取当前被修改的商品对象
    let {cart} = this.data
    let index = cart.findIndex(v=>v.goods_id === checkId) 
    console.log('当前被修改的对象是===',index)

    //3 被选中的商品状态 checked 进行取反操作
    cart[index].checked = !cart[index].checked

    //4 重新 设置data 及 缓存， 设置总价格 总数量
    this.setCart(cart)
  },

  //点击全选按钮
  handlerAllCheck(){
    //获取现在的cart数组
    let {cart} = this.data
    //判断如果现在不是全选 状态改为全选，如果是全选状态改为不全选
    let isAllchk = cart.every(v => v.checked)
    if(isAllchk){ //现在都是选中的，改为全不选
      cart.map(item => {
        item.checked = !item.checked
      })
    }else{ //现在不是全部选中 改为全选
      cart.map(item => {
        item.checked = true
      })
    }


    //重新设置 cart数组、缓存、以及重新计算数量
    this.setCart(cart)
  },

  //点击 减少商品数量
  editGoodsNum(e){
    //获取选中id
    let checkId = e.currentTarget.dataset.id
    //找到 当前点击的是哪个商品
    let {cart} = this.data
    let index = cart.findIndex(v => v.goods_id === checkId)

    //将此商品数量减1


     //商品数量剩余为1 的时候 进行弹窗提示是否删除
     if(cart[index].num === 1){
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否要删除',
        success (res) {
          if (res.confirm) {
            cart[index].num--
            cart.splice(index,1)
            //更新数据 重新计算
            that.setCart(cart)
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      
     }else{
      cart[index].num--
      //更新数据 重新计算
      this.setCart(cart)
     }
    //  if(cart[index].num === 0){ //从数据种删除
    //   cart.splice(index,1)
    //  }


  },

  //点击 增加商品数量
  addGoodsNum(e){
    //获取选中id
    let checkId = e.currentTarget.dataset.id
    //找到 当前点击的是哪个商品
    let {cart} = this.data
    let index = cart.findIndex(v => v.goods_id === checkId)
    //将此商品数量加1
    cart[index].num++
     //更新数据 重新计算
     this.setCart(cart)
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

  //点击支付按钮
  handlerPay(){
    let {address,totalNum} = this.data
    //判断是否有收货信息
    if(!address.userName){
      wx.showToast({
        title: '无选择收货地址',
      });
      return;
    }

    //判断是否有选购商品
    if(totalNum === 0){
      wx.showToast({
        title: '无商品',
      });
      return;
    }

    //跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
      
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