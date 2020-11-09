// pages/category/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftTitle:[],//分类左边 产品名称栏目
    rightConent:[],//右边详细信息
  },
  cateList:[],//所有分类信息

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates();
  },
  getCates(){
    request({
      url:'https://api-hmugo-web.itheima.net/api/public/v1/categories'
    }).then(res => {
      console.log('获取到的数据是',res)
      this.cateList = res.data.message;
      let leftTitle = this.cateList.map(v => v.cat_name) //左边数据
      let rightConent = this.cateList[0].children
      this.setData({
        leftTitle,rightConent
      })
    })
  }

  
})