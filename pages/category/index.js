// pages/category/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    leftTitle:[],//分类左边 产品名称栏目
    rightConent:[],//右边详细信息
    clickindex:0,//当前被点击的选项栏
  },
  cateList:[],//所有分类信息

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*先判断是否有旧的数据，
    {time:Data.now(),dataP:[]}
    没有旧数据发送新请求
    有旧数据判断是否过期，一旦过期就发送
    */

    let Cates = wx.getStorageSync('cates');
    if(!Cates){ //如果没有请求过  执行请求
      this.getCates();

    }else{ //判断是否在过期时间内
      if((Date.now() - Cates.time) < 1000*10){
        console.log('用之前的数据')
        let leftTitle = Cates.data.map(v => v.cat_name) //左边数据
        let rightConent = Cates.data[0].children
        this.setData({
          leftTitle,rightConent
        })
      }else{
        console.log('重新请求数据')
        this.getCates();
      }
    }
    // this.getCates();
  },

  getCates(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/categories'
    }).then(res => {
      console.log('获取到的数据是',res)
      this.cateList = res.data.message;
      wx.setStorageSync('cates', {
        time:Date.now(),
        data:res.data.message
      });
        
      let leftTitle = this.cateList.map(v => v.cat_name) //左边数据
      let rightConent = this.cateList[0].children
      this.setData({
        leftTitle,rightConent
      })
    })
  },
  handlerItemTap(e){
    console.log('eshi ',e)
    //拿到不同的索引 渲染页面
    let rightConent = this.cateList[e.currentTarget.dataset.index].children

    this.setData({
      clickindex:e.currentTarget.dataset.index,
      rightConent
    })
  }


})