const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    layer: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false
  },

  lifetimes: {
    attached() {
      let menuButton = app.globalData.systemInfo.menuButton
      this.setData({
        paddingTop: menuButton.top + menuButton.height,
        bgColor: app.globalData.themeColor
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapBack: function() {
      wx.navigateBack({
        delta: 1
      })
    },

    showLoading: function() {
      this.setData({
        loading: true
      })
    },

    hideLoading: function() {
      this.setData({
        loading: false
      })
    },

    getLoadingStatus: function() {
      return this.data.loading
    }
  }
})
