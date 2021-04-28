const windowWidth = wx.getSystemInfoSync().windowWidth;
const colorArr = ["#f94144", "#f9c74f", "#43aa8b"]

const convertToPx = (rpx) => {
  return rpx / 750 * windowWidth;
}

export{convertToPx, colorArr}