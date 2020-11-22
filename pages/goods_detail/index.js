// pages/goods_detail/index.js
//部分iphone不支持 webp格式
/*
2点击轮播图 预览大图
  1.给轮播图绑定点击事件
  2.调用小程序的api previewImage
3点击加入购物车
  1.绑定点击事件
  2.获取缓存中的购物车数据 数组格式
  3.先判断 当前的商品是否已经存在于 购物车、
  4.已经存在 修改商品数据 执行购物车数量++ 重新吧购物车数组 填充回缓存中
  5。不在存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上购买数量属性 num 重新吧购物车数组 填充回缓存中
  6.弹出提示
*/
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_detail:{}
  },
  GoodsInfo:{},//单独存放的 商品对象

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options
    console.log('拿到的商品id是===',goods_id)
    this.getDetail(goods_id)
  },

  getDetail(goods_id){
    //获取商品详细数据
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/detail',
      data:{
        goods_id:goods_id
      }
    }).then(res =>{
      console.log('返回数据是',res)
      console.log(res)
      const goodsObj = res.data.message
      this.GoodsInfo = goodsObj
      this.setData({ //data中只保存 页面渲染需要使用的数据
        goods_detail:{
          goods_name:goodsObj.goods_name,
          goods_price:goodsObj.goods_price,
          //部分iphone手机 不识别webp图片格式
          //1.找后台进行修改(正常情况下 后台要修改)
          //2.前端临时自己修改 确保后台存在1.webp => 1.jpg
          goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics:goodsObj.pics
        }
      })
    })
  },

  //点击swiper 放大图片展示的效果
  handlerPreviewImage(e){
    const current = e.currentTarget.dataset.image
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    wx.previewImage({
      current: current, //展示的第一张的图片
      urls: urls, //展示的轮播图数组

    });
      
  },

  //点击 加入购物车
  handlerCartAdd(){
    // console.log('加入购物车')
    let cartDetail = wx.getStorageSync('cart') || []; //确保是数组
    console.log('本地存储里面有数据吗',cartDetail)
    let index = cartDetail.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id) //本地存储中的商品id 是否和 当前商品id相同 如果相同返回当前相同的下标位置
    console.log('从本地存储里面查到数据了吗',index)

    if(index === -1){ //没有查询到相同id
      this.GoodsInfo.num = 1
      cartDetail.push(this.GoodsInfo)
    }else{
      cartDetail[index].num++
    }

    wx.setStorageSync('cart', cartDetail);
    wx.showToast({
      title: '加入购物车成功',
      mask: true,
      icon:'success'

    });
      
      
      
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