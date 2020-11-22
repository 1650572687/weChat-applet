export const getSetting = ()=> { //获取权限
    return new Promise((resolve,reject) => {
        wx.getSetting({
            success: (result1) => {
                resolve(result1)
            },
            fail: (err1) => {
                reject(err1)
            },
            complete: () => {}
        });
          
    })
}

export const openSetting = () => { //设置权限
    return new Promise((resolve,reject) => {
        wx.openSetting({
            success: (result2) => {
                resolve(result2)
            },
            fail: (err2) => {
                reject(err2)
            },
            complete: () => {}
        });
          
    })
}

//获取 通信地址
export const getChoseAddress = () => {
    return new Promise((resolve,reject) => {
        wx.chooseAddress({
            success: (result3) => {
                resolve(result3)
            },
            fail: (err3) => {
                reject(err3) 
            },
            complete: () => {}
        });
          
    })
}