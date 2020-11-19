// pages/goods_list/index.js
import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //虚拟tab数据
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      },
    ],
    goodList:[],
    total:'',//商品列表 当前请求的总数


  },
  queryParams:{
    query:'',//关键字
    cid:"",//分类id
    pagenum:1,//页码
    pagesize:10,//页容量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('分类页面传递过来的商品id是==',options.cid)
    this.queryParams.cid = options.cid
    this.getgoodList()
  },
  tapItemChange(e){
    //传递过来的索引是
    let index1 = e.detail
    //先将存储的tabs数据解构出来，后期修改完毕后 统一set添加
    let {tabs} = this.data
    tabs.map((item,index) =>{
      if(index === index1){  //当前循环到的下标 等于子组件传递过来的下标
        item.isActive = true
      }else{
        item.isActive = false
      }
    })

    //将修改完毕的数组 重新赋值顶替掉原来的数组
    this.setData({
      tabs
    })
  },
  getgoodList(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/search',
      data:this.queryParams
    }).then(res => {
      console.log('结果是=====',res)
      //存储当前的商品列表
      this.setData({
        goodList:[...this.data.goodList,...res.data.message.goods],
        total:res.data.message.total
      })
    })
  },


  //下拉触底，加载数据
  onReachBottom(){
    console.log("下拉触底了")
    if(this.data.goodList.length >= this.data.total){
      wx.showToast({
        title: '没有更多数据了',
      });
    }else{
      this.queryParams.pagenum++
      this.getgoodList()

        
    }
  },

})