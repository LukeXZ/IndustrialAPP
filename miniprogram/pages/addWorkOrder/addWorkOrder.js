const app = getApp()
const db = wx.cloud.database()
import {deviceList, attributeList, levelList} from '../../utils/Model' // 引入参数列表{风机列表，属性列表，风险等级列表}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutInfo: app.globalData.layoutInfo,
    deviceList: deviceList,
    attributeList: attributeList,
    levelList: levelList,
    currentDeviceIndex: 0, // 选中轴承号索引
    currentLevelIndex: 2 // 选中风险等级索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.deviceIndex) {
      this.setData({
        currentDeviceIndex: options.deviceIndex
      })
    }
    if(options.description) {
      this.setData({
        description: options.description
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //选择器方法
  changeSelection: async function(e) {
    let index = e.currentTarget.dataset.id // 确定是哪一个picker组件发出的事件
    let value = e.detail.value // 获取到该picker组件更改后的值
    // 根据index分别赋值
    switch(index) {
      case "0": // 选择器为风机设备编号
        console.log("当前选择的轴承：", this.data.deviceList[value].name)
        this.setData({
          currentDeviceIndex: parseInt(value)
        })
        break
      case "1": // 选择器为等级
        console.log("当前选择的等级：", this.data.levelList[value].name)
        this.setData({
          currentLevelIndex: parseInt(value)
        })
        break
      default:
        console.log("选择项无效")
        break
    }
  },

  submit: function(e) {
    app.hapticFeedback()
    let device = e.detail.value.device
    let level = e.detail.value.level
    let description = e.detail.value.description
    let uploader = e.detail.value.uploader
    if(!description || !uploader) {
      wx.showToast({
        title: '信息不完整',
        icon: 'none',
        duration: 1000
      })
      return
    }
    console.log(device, level)
    let date = new Date()
    let dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    db.collection('work_order_pending').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        device: deviceList[device].value,
        level: levelList[level].value,
        description: description,
        uploader: uploader,
        timestamp: dateString
      }
    })
    .then(res => {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
    })
  }
})