const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutInfo: app.globalData.layoutInfo,
    pendingList: [],
    historyList: [],
    order: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.switcher = this.selectComponent("#order-switcher")
    this.switcher.initialize(this.changeOrder, ["时间", "优先级"])
    this.header = this.selectComponent("#header")
    
    this.refreshWorkOrder()
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
    this.refreshWorkOrder()
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


  // 从云开发服务器获取工单列表
  getWorkOrderPending: function(order) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'getWorkOrderPending',
        // 传给云函数的参数
        data: {
          order: order
        },
        success(res) {
          if(res.result.data) {
            that.setData({
              pendingList: res.result.data
            })
          }
          resolve()
        },
        fail(res) {
          reject()
        }
      })
    })
  },

  getWorkOrderHistory: function() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'getWorkOrderHistory',
        // 传给云函数的参数
        success(res) {
          if(res.result.data) {
            that.setData({
              historyList: res.result.data.reverse()
            })
          }
          resolve()
        },
        fail(res) {
          reject()
        }
      })
    })
  },

  //事件绑定方法
  addWorkOrder: function() {
    app.hapticFeedback()
    wx.navigateTo({
      url: '/pages/addWorkOrder/addWorkOrder'
    })
  },

  tapWorkOrder: function(e) {
    console.log(e.target)
    let index = e.target.dataset.id
    let type = e.target.dataset.type
    let target = type+"Ani"
    app.createButtonAni(this, e, target, () => {
      if(type === "pending") {
        app.globalData.currentWorkOrder = this.data.pendingList[index]
      } else {
        app.globalData.currentWorkOrder = this.data.historyList[index]
      }
      wx.navigateTo({
        url: '/pages/workOrderDetail/workOrderDetail',
      })
    })
  },

  bindTick: function(e) {
    console.log(e)
    let type = e.target.dataset.type
    if(type === 'pending') {
      this.doneWorkOrder(e)
    } else {
      this.deleteWorkOrder(e)
    }
  },

  changeOrder: async function(index) {
    this.setData({
      order: index
    })
    await wx.showLoading({
      title: '加载中...',
    })
    try {
      await this.getWorkOrderPending(this.data.order)
    } catch (error) {
      console.log("获取待处理工单错误")
    }
    await wx.hideLoading({})
  },

  // 工单方法
  refreshWorkOrder: async function() {
    this.header.showLoading()
    let promiseArr = [this.getWorkOrderHistory(), this.getWorkOrderPending()]
    await Promise.all(promiseArr)
    this.header.hideLoading()
  }
})