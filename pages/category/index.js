// pages/category/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listdata:[],//总数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let categoryReq = {
      url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
    }
    this.getData(categoryReq);
  },

  getData(url){
    // console.log(url)
    request(url).then(res => {
      console.log('返回值',res)
      this.setData({
        listdata:res.data.message
      })
    })
  }


})