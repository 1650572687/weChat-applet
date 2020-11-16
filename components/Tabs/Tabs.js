// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){

      let {index} = e.currentTarget.dataset
      //获取索引
      // console.log('切换tab的索引是',index)
      //将索引传递给 父组件
      this.triggerEvent('tapItemChange',index)
    }
  }
})
