const app = getApp()
const systemInfo = wx.getSystemInfoSync()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: String,
    mode: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    contentType: 0
  },

  lifetimes: {
    attached() {
      this.resetContentSwitcher()
      this.setData({
        color: (this.data.theme == 'dark')? 'white':'blue'
      })
    }
  },

  observers: {
    'theme': function(theme) {
      this.changeIcon(theme)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initialize: function(handler, options) {
      this.handler = handler
      if(this.data.mode) {
        this.setData({
          options: options
        })
      }
    },

    resetContentSwitcher:function(){
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out"
      })
      animation.translateX( (0 * 150 + 10) / 750 * systemInfo.windowWidth).step()
      this.setData({
        contentSwitcherAni: animation.export(),
        contentType: 0
      })
    },
  
    selectContent:function(e){
      app.hapticFeedback()
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out"
      })
      animation.translateX( (e.currentTarget.dataset.contentType * 150 + 10) / 750 * systemInfo.windowWidth).step()
      this.setData({
        contentSwitcherAni: animation.export(),
        contentType: parseInt(e.currentTarget.dataset.contentType)
      })
      console.log("内容："+e.currentTarget.dataset.contentType)
      this.handler(this.data.contentType)
    },

    changeIcon: function(theme) {
      let that = this
      app.changeIcon(theme, this)
    },

    changeSelection: function(index) {
      app.hapticFeedback()
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease-in-out"
      })
      animation.translateX( (index * 150 + 10) / 750 * systemInfo.windowWidth).step()
      this.setData({
        contentSwitcherAni: animation.export(),
        contentType: index
      })
      console.log("内容："+ index)
      this.handler(this.data.contentType)
    }
  },
})
