import * as echarts from '../components/ec-canvas/echarts'; // 引入echarts组件
// 初始化canvas图表方法定义
export default function initChart(canvas, width, height, dpr) {
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