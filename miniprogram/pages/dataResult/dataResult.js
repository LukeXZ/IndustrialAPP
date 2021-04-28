const app = getApp()
import * as echarts from '../../components/ec-canvas/echarts'; // 引入echarts组件
let chart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart // 在canvas初始化时交给initChart函数
    },
    layoutInfo: app.globalData.layoutInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.compare) {
      this.setData({
        GBDTOutput: app.globalData.GBDTOutput,
        SVMOutput: app.globalData.SVMOutput
      })
      setTimeout(() => {
        this.prepareMultipleData()
      }, 500);
    } else {
      this.setData({
        type: options.type,
        defaultOutput: app.globalData[options.type + 'Output']
      })
      setTimeout(() => {
        this.prepareData()
      }, 500);
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
  
  prepareMultipleData: function() {
    let GBDT = []
    let SVM = []
    for(let key in this.data.GBDTOutput) {
      GBDT.push(this.data.GBDTOutput[key])
    }
    for(let key in this.data.SVMOutput) {
      SVM.push(this.data.SVMOutput[key])
    }
    let options = {
      title: {
        text: '性能对比'
      },
      legend: {
        data:['GBDT', 'SVM']
      },
      xAxis: {
        data: ['accuracy', 'recall', 'precision', 'fMeasure', 'rocArea']
      },
      series: [{
        name: 'GBDT',
        type: 'bar',
        data: GBDT
      },
      {
      name: 'SVM',
      type: 'bar',
      data: SVM
      }]
    }
    chart.setOption(options)
  },

  prepareData: function() {
    let data = []
    for(let key in this.data.defaultOutput) {
      data.push(this.data.defaultOutput[key])
    }
    let options = {
      title: {
        text: '性能'
      },
      legend: {
        data:[this.data.type]
    },
      xAxis: {
        data: ['accuracy', 'recall', 'precision', 'fMeasure', 'rocArea']
      },
      series: [{
        name: this.data.type,
        type: 'bar',
        data: data
      }]
    }
    chart.setOption(options)
  }
})

// 初始化canvas图表方法定义
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  
  var option = {
    title: {
      text: '性能对比'
    },
    tooltip: {},
    legend: {

    },
    xAxis: {
      data: ['accuracy', 'recall', 'precision', 'fMeasure', 'rocArea']
    },
    yAxis: {},
    series: []
  };
  chart.setOption(option);
  return chart;
}