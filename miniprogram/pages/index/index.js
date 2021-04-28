import * as echarts from '../../components/ec-canvas/echarts'; // 引入echarts组件
import {deviceList, attributeList, groupList} from '../../utils/Model' // 引入参数列表{风机列表，属性列表，组列表}
import {httpPost} from '../../utils/requests' // 引入公共请求方法
import {colorArr} from '../../utils/layout'
import {Cycle} from '../../utils/util'
const app = getApp() // 获取App实例
let chart = null;
let timer1 = null;
let timer2 = null;

Page({
  data: {
    colorArr: colorArr,
    layoutInfo: app.globalData.layoutInfo, // 用于计算自定义导航栏Layout尺寸
    ec: {
      onInit: initChart // 在canvas初始化时交给initChart函数
    },
    apiKey: "", 
    apiSecret: "",
    token: "",
    activeData: [],
    deviceList: deviceList,
    attributeList: attributeList,
    groupList: groupList,
    currentDeviceIndex: 0, // 当前工况索引
    currentAttributeIndex: 0, // 当前属性索引
    currentGroupIndex: 0, // 当前分组索引
    textArr: ["正常","外环损伤1级","外环损伤2级","内环损伤1级","内环损伤2级"]
  },

  onLoad(options) {
    this.header = this.selectComponent("#header")
    this.loadContent() // 页面加载时加载数据

    this.meter = this.selectComponent("#meter")
  },

  onShow() {
    if(this.data.paderbornData) {
      this.cyclePaderbornData()
    }
    if(this.data.classified) {
      this.cycleClassificationData()
    }
  },

  onHide() {
    if(timer1) {
      timer1.stopCycle()
      timer1 = null
    }
    if(timer2) {
      timer2.stopCycle()
      timer2 = null
    }
  },

  onUnload() {
    if(timer1) {
      timer1.stopCycle()
      timer1 = null
    }
    if(timer2) {
      timer2.stopCycle()
      timer2 = null
    }
  },

  loadContent: async function() {
    this.header.showLoading()
    // 在async异步函数里，等待获取API信息
    try {
      await this.getAPIInfo()
    } catch(e) {
      this.header.hideLoading()
      console.log("获取API信息失败", e)
      return
    }
    // 接下来用获取到的API信息，等待获取token
    try {
      await this.getToken()
    } catch(e) {
      this.header.hideLoading()
      console.log("获取token失败", e)
      return
    }

    try {
      await this.getPaderbornData()
    } catch(e) {
      this.header.hideLoading()
      console.log("获取轴承数据失败", e)
      return
    }
    // 接下来用获取到的token，等待获取到所需数据
    
    // 根据获取到的数据更新canvas图表
    //this.updateChart()
    try {
      await this.classify()
    } catch(e) {
      this.header.hideLoading()
      console.log("分类失败", e)
      return
    }
    this.cyclePaderbornData()
    this.cycleClassificationData()
    this.header.hideLoading()
  },

  // 以上async函数中用到的三个期约(Promise)函数的定义
  getAPIInfo: async function() {
    let url = "auth/apiInfo"
    let data = {
      username: '2018210569',
      password: '2018210569'
    }
    var res = await httpPost(url, data)
    console.log("获取APIINFO：成功")
    this.setData({
      apiKey: res.apiKey,
      apiSecret: res.apiSecret
    })
  },

  getToken: async function() {
    let url = "auth/access_token"
    let data = {
      api_key: this.data.apiKey,
      api_secret: this.data.apiSecret
    }
    var res = await httpPost(url, data)
    console.log("获取token：成功")
    this.setData({
      token: res.access_token
    })
    app.globalData.token = res.access_token
  },

  classify: async function() {
    await this.dataCleaning()
    await this.featureExtraction()
    await this.classification()
  },

  dataCleaning: async function() {
    let url = "component/pre/iso"
    let data = {
      access_token: this.data.token,
      file_name: this.data.deviceList[this.data.currentDeviceIndex].value + "_test.csv",
    }
    var res = await httpPost(url, data)
    this.data.cleanedData = res
  },

  featureExtraction: async function() {
    this.header.showLoading()
    let url = "component/upload/2/435"
    let data = {
      access_token: this.data.token,
      file_name: this.data.cleanedData.file_name
    }
    var res = await httpPost(url, data)
    this.data.featureExtracted = res
    this.header.hideLoading()
  },

  classification: async function() {
    let url = "component/upload/ML/model/158/368"
    let data = {
      access_token: this.data.token,
      file_name: this.data.featureExtracted.file_name
    }
    var res = await httpPost(url, data)
    this.data.classified = res
    this.setData({
      accuracy: 100*res.result.accuracy.toFixed(2)
    })
  },
  
  getPaderbornData: async function() {
    let url = "component/data/paderborn"
    let deviceIndex = this.data.currentDeviceIndex
    let attributeIndex = this.data.currentAttributeIndex
    let data = {
      access_token: this.data.token,
      device_id: this.data.deviceList[deviceIndex].value,
      attribute: this.data.attributeList[attributeIndex].value
    }
    var res = await httpPost(url, data)
    this.data.paderbornData = res
  },

  cyclePaderbornData: function() {
    function handler(data) {
      this.data.activeData = data
      this.updateChart()
    }
    timer1 = new Cycle(this.data.paderbornData[attributeList[this.data.currentAttributeIndex].value], handler.bind(this))
    timer1.startCycle()
  },

  cycleClassificationData: function() {
    function handler(data) {
      console.log("currentStatus: ", data)
      this.setData({
        currentStatus: data
      })
    }

    function stop() {
      //this.meter.drawCircle(0)
      this.data.currentStatus = -1
    }

    timer2 = new Cycle(this.data.classified.predict, handler.bind(this), stop.bind(this))
    timer2.startSingleCycle()
  },

  //选择器方法
  changeSelection: async function(e) {
    if(this.header.getLoadingStatus()) {
      console.log("正在加载...")
      return
    }
    let index = e.currentTarget.dataset.id // 确定是哪一个picker组件发出的事件
    let value = e.detail.value // 获取到该picker组件更改后的值
    // 根据index分别赋值
    switch(index) {
      case "0": // 选择器为风机设备编号
        console.log("当前选择的风机：", this.data.deviceList[value].value)
        this.setData({
          currentDeviceIndex: parseInt(value)
        })
        break
      case "1": // 选择器为属性
        console.log("当前选择的属性：", this.data.attributeList[value].name)
        this.setData({
          currentAttributeIndex: parseInt(value)
        })
        break
      default:
        console.log("选择项无效")
        break
    }

    timer1.stopCycle()
    timer2.stopCycle()
    // 根据更改后的信息重新请求数据
    this.header.showLoading()
    try {
      await this.getPaderbornData()
    } catch(e) {
      console.log("更新数据失败")
      return
    }

    try {
      await this.classify()
    } catch(e) {
      console.log("分类失败")
      return
    }
    this.cyclePaderbornData()
    this.cycleClassificationData()

    this.header.hideLoading()
  },

  // 更新图表方法
  updateChart: function() {
    // 利用chart对象的setOptions方法异步更新视图
    chart.setOption({
      title: {
        text: this.data.deviceList[this.data.currentDeviceIndex].value // 设定图表标题
      },
      xAxis: {
        data: [1,2,3,4,5,6,7,8,9,10] // 设定图表X轴坐标
      },
      yAxis: {
        type: "value", // 设定图表Y轴坐标数据类型
        name: this.data.attributeList[this.data.currentAttributeIndex].name // 设定图表Y轴坐标
      },
      series: [
        {
          name: this.data.attributeList[this.data.currentAttributeIndex].name, // 设定折线名称
          type: 'line', // 设定图表类型为折线图
          data: this.data.activeData // 设定图表数据
        }
      ]
    })
  },

  goAddWorkOrder: function(e) {
    let deviceIndex = this.data.currentDeviceIndex
    let description = this.data.textArr[this.data.currentStatus]
    app.createButtonAni(this, e, "addWorkerAni", ()=>{
      wx.navigateTo({
        url: '/pages/addWorkOrder/addWorkOrder?deviceIndex=' + deviceIndex + '&description=' + description
      })
    })
  }
});

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

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

    ]
  };

  chart.setOption(option);
  return chart;
}