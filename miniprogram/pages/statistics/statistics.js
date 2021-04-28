import * as echarts from '../../components/ec-canvas/echarts'; // 引入echarts组件
const app = getApp()
let chartA = null
let chartB = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutInfo: app.globalData.layoutInfo,
    chartA: {
      onInit: initChartA // 在canvas初始化时交给initChart函数
    },
    chartB: {
      onInit: initChartB // 在canvas初始化时交给initChart函数
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.cloud.callFunction({
      name: 'getStatistics'
    }).then(res => {
      console.log(res.result)
      this.updateChart("A", res.result.processed)
      this.updateChart("B", res.result.malfunction)
    })
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

  updateChart: function(chartID, data) {
    // 利用chart对象的setOptions方法异步更新视图
    const charts = {
      "A": chartA,
      "B": chartB
    }
    charts[chartID].setOption({
      title: {
        text: (chartID == 'A')? "日工单处理情况":"轴承损坏情况"
      },
      xAxis: {
        data: Object.keys(data) // 设定图表X轴坐标
      },
      yAxis: {
        type: "value", // 设定图表Y轴坐标数据类型
        name: (chartID == 'A')? "单":"个" // 设定图表Y轴坐标
      },
      series: [
        {
          name: "数量", // 设定折线名称
          type: 'bar', // 设定图表类型为折线图
          data: Object.values(data) // 设定图表数据
        },
      ]
    })
  }
})

function initChartA(canvas, width, height, dpr) {
  chartA = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chartA);

  var option = {
    color: ["#3298DB"],
    xAxis: {
      data: []
    },

    yAxis: {

    },
    legend: {

    },
    tooltip: {
      triggerOn: "mousemove|click",
      alwaysShowContent: true,
      position: function(pt) {
        return [pt[0], 130];
      },
      showContent: true,
      
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        var obj = {top: 60};
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    series: []
  };

  chartA.setOption(option);
  return chartA;
}

function initChartB(canvas, width, height, dpr) {
  chartB = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chartB);

  var option = {
    color: ["#3298DB"],
    xAxis: {
      data: [],
      axisPointer: {
        value: "3",
        snap: true,
        label: {
          show: true,
          formatter: function(params) {
            return params.value;
          }
        },
        handle: {
          show: true,
          margin: 40,
          size: 30
        }
      }
    },
    xAxis: {
      data: [1,2,3,4] // 设定图表X轴坐标
    },

    yAxis: {

    },
    legend: {

    },
    tooltip: {
      triggerOn: "mousemove|click",
      alwaysShowContent: true,
      position: function(pt) {
        return [pt[0], 130];
      },
      showContent: true,
      
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        var obj = {top: 60};
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    series: [
      {
        name: "demo", // 设定折线名称
        type: 'bar', // 设定图表类型为折线图
        data: [4,3,2,1] // 设定图表数据
      }
    ]
  };

  chartB.setOption(option);
  return chartB;
}