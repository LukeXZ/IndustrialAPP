const systemInfo = wx.getSystemInfoSync()
import {convertToPx} from './utils/layout'
//app.js
App({
  onLaunch: function () {
    let menuButton = wx.getMenuButtonBoundingClientRect()
    this.globalData.systemInfo = {...systemInfo, menuButton}
    this.calcLayout()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "wujucloud-jyxuq",
        traceUser: true,
      })
    }
  },

  globalData: {
    themeColor: "#3298DB"
  },

  calcLayout: function() {
    let menuButton = this.globalData.systemInfo.menuButton
    let top = menuButton.top + menuButton.height + convertToPx(120)
    let layoutInfo = {
      menuButton: menuButton,
      top: top,
      minHeight: `calc( 100vh - ${top}px )`
    }
    this.globalData.layoutInfo = layoutInfo
  },

  //按钮动画及振动方法
  createButtonAni: function(that, e, targetData, task){
    this.hapticFeedback()
    this.touchButton(that, e, targetData)
    setTimeout(() => {
      this.leaveButton(that, e, targetData)
      task()
    }, 150);
  },

  touchButton: function(that, e, targetData){
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-in"
    })
    if(e.target.dataset.id){
      var num = e.target.dataset.id
    } else{
      var num = 0
    }  
    //console.log(num+"touch")
    that.animation = animation
    animation.scale(0.95, 0.95).step()
    var currentAnimation = ""+targetData+"["+num+"]"
    that.setData({
      [currentAnimation]: animation.export()
    })
  },

  leaveButton: function(that, e, targetData){
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-in"
    })
    if(e.target.dataset.id){
      var num = e.target.dataset.id
    } else{
      var num = 0
    }  
    //console.log(num+"leave")
    that.animation = animation
    animation.scale(1, 1).step()
    var currentAnimation = ""+targetData+"["+num+"]"
    that.setData({
      [currentAnimation]: animation.export()
    })
  },

  hapticFeedback: function() {
    wx.vibrateShort({
      success: (res) => {},
    })
  }
})
