import {request} from '../../request/index'
//Page Object
Page({
  data: {
    //存放banner图片数据
    bannerList:[],
    //导航栏图片数据
    catesList:[],
    password:""
  },
  //options(Object)
  //页面开始加载就会触发
  onLoad: function(options){
    let bannerReq = {
      url:'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
    }

    let catesReq = {
      url:'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
    }
    //发接口，查询banner图
    this.getSwiperList(bannerReq);
    //发接口，查询导航栏
    this.getCatesList(catesReq);
  },

  //banner数据
  getSwiperList(params){
    request(params).then(r => {
      this.setData({
        bannerList:r.data.message
      })
    })
  },

  //导航栏数据
  getCatesList(params){
    request(params).then(r => {
      this.setData({
        catesList:r.data.message
      })
    })
  },

  changeSearch(event){
    let that = this
    var inputNum  = event.detail.value;
    that.setData({
      password:inputNum
    })
    console.log('this.password',event.detail.value)
    
    console.log('this.password',that.data.password)
  }

});