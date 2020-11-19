//判断多次请求是否完毕
let ajaxTimes = 0
export const request = (params)=>{
  ajaxTimes++
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
    
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTimes--
        if(ajaxTimes === 0){//所有请求完毕，关闭加载栏目
          wx.hideLoading();
        }
          
      }

    });
  })
}