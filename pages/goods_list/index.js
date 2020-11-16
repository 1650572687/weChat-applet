// pages/goods_list/index.js
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('分类页面传递过来的商品id是==',options.cid)
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
  }


})