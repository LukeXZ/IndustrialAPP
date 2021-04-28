const app = getApp()
const db = wx.cloud.database() // 获取云开发数据库实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutInfo: app.globalData.layoutInfo,
    judgement: false,
    levelText: ["中", "高", "低"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentWorkOrder: app.globalData.currentWorkOrder
    })
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

  tapButton: async function(e) {
    app.createButtonAni(this, e, "buttonAni", () => {
      if(this.data.currentWorkOrder.doneTimestamp) {
        this.deleteWorkOrder()
      } else {
        this.doneWorkOrder()
      }
    })
  },

  changeJudgement: function(e) {
    this.setData({
      judgement: e.detail.value
    })
  },

  submitForm: async function(e) {
    app.hapticFeedback()
    let result = await wx.showModal({
      title: '是否要完成工单'
    })
    if(result.cancel) {
      return
    }
    let judgement = e.detail.value.judgement
    let dealDescription = e.detail.value.dealDescription
    let dealer = e.detail.value.dealer
    if(!dealDescription || !dealer) {
      wx.showToast({
        title: '信息不完整',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.data.dealInfo = {
      judgement: judgement,
      dealDescription: dealDescription,
      dealer: dealer
    }
    await this.doneWorkOrder()
  },


  doneWorkOrder: async function(e) {
    await wx.showLoading({
      title: '处理中...',
    })
    try {
      await db.collection('work_order_pending').where({
        _id: this.data.currentWorkOrder._id
      }).remove()
    } catch (error) {
      console.log("将工单从待处理移除错误", error)
    }
    let date = new Date()
    let dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    try {
      await db.collection('work_order_history').add({
        data: {
          device: this.data.currentWorkOrder.device,
          level: this.data.currentWorkOrder.level,
          description: this.data.currentWorkOrder.description,
          uploader: this.data.currentWorkOrder.uploader,
          judgement: this.data.dealInfo.judgement,
          dealDescription: this.data.dealInfo.dealDescription,
          dealer: this.data.dealInfo.dealer,
          timestamp: this.data.currentWorkOrder.timestamp,
          doneTimestamp: dateString
        }
      })
    } catch (error) {
      console.log("添加工单至历史出现错误", error)
    }
    await wx.hideLoading({})
    await wx.showToast({
      title: '已完成！',
      icon: 'none',
      duration: 1000
    })
    wx.navigateBack({
      delta: 1
    })
  },

  deleteWorkOrder: async function(e) {
    let result = await wx.showModal({
      title: '是否要删除历史'
    })
    if(result.cancel) {
      return
    }
    await wx.showLoading({
      title: '处理中...',
    })
    try {
      await db.collection('work_order_history').where({
        _id: this.data.currentWorkOrder._id
      }).remove()
    } catch(error) {
      console.log("删除工单失败", error)
      return
    }
    await wx.hideLoading({})
    await wx.showToast({
      title: '删除成功！',
      icon: 'none',
      duration: 1000
    })
    wx.navigateBack({
      delta: 1
    })
  }
})