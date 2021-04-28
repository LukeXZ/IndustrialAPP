const host = "https://phmlearn.com/"

/**
 * @param {string} url
 */
const httpGet =  url => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'GET',
      success(res) {
        if(res.data.success == true) {
          resolve(res.data.data)
        } else {
          console.log("服务器错误！")
          reject(res.data.msg)
        }
      },
      fail() {
        console.log("与服务器通信失败！")
        reject()
      }
    })
  })
}

/**
 * @param {string} url
 * @param {Object} data
 */
const httpPost =  (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: data,
      success(res) {
        if(res.data.success == true) {
          resolve(res.data.data)
        } else {
          console.log("服务器错误！")
          reject(res.data.msg)
        }
      },
      fail() {
        console.log("与服务器通信失败！")
        reject()
      }
    })
  })
}

export {httpGet, httpPost}