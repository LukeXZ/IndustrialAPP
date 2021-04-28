const animationStep = 0.05
import {colorArr} from '../../utils/layout'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: Number
  },

  lifetimes: {
    ready() {
      //this.drawProgressbg()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    progressText: "loading...",
    count: 0,
    prevStatus: -1,
    colorArr: ["#43aa8b", "#f9c74f", "#f94144", "#f9c74f", "#f94144"],
    textArr: ["正常","外环损伤1级","外环损伤2级","内环损伤1级","内环损伤2级"]
  },

  observers: {
    "status": function(status) {
      if(this.data.prevStatus !== status) {
        switch(status) {
          case 0: {
            this.drawCircle(1.4)
            this.data.prevStatus = 0
            break
          }
          case 1: {
            this.drawCircle(0.4)
            this.data.prevStatus = 1
            break
          }
          case 2: {
            this.drawCircle(0.2)
            this.data.prevStatus = 2
            break
          }
          case 3: {
            this.drawCircle(0.4)
            this.data.prevStatus = 3
            break
          }
          case 4: {
            this.drawCircle(0.2)
            this.data.prevStatus = 4
            break
          }
        }
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    completeHandler: function() {
      console.log("done")
    },

    drawProgressbg: function(){
      const query = this.createSelectorQuery()
      query.select('#canvasProgressbg')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          ctx.lineWidth = 6;// 设置圆环的宽度
          ctx.strokeStyle = '#eeeeee'; // 设置圆环的颜色
          ctx.lineCap = 'round' // 设置圆环端点的形状
          ctx.beginPath();//开始一个新的路径
          ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
          //设置一个原点(110,110)，半径为100的圆的路径到当前路径
          ctx.stroke();//对当前路径进行描边
        })
    },

    drawCircle: function (step){ 
      const query = this.createSelectorQuery()
      query.select('#canvasProgress')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          // 设置渐变
          var gradient = ctx.createLinearGradient(50, 150, 150, 100);
          /*
          gradient.addColorStop("0", "#b6daff");
          gradient.addColorStop("0.5", "#7fbeff");
          gradient.addColorStop("1.0", "#47a0ff");
          */

         gradient.addColorStop("0", "#E74C3C");
         gradient.addColorStop("0.5", "#F1C40E");
         gradient.addColorStop("1", "#2FCC71");
          
          ctx.lineWidth = 12;
          ctx.strokeStyle = gradient;
          ctx.lineCap = 'round'
          // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
          let render
          if(this.data.count <= step + animationStep/2) {
            render = () => {
              if (this.data.count <= step + animationStep/2) {
                ctx.clearRect(0,0,canvas.width, canvas.height)
                /* 绘制彩色圆环进度条  
                注意此处 传参 step 取值范围是0到2，
                所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                */
                this.renderArc(ctx, this.data.count.toFixed(2))
                this.data.count = this.data.count + animationStep
                canvas.requestAnimationFrame(render)
              } else {
                if(step >= 2) {
                  this.completeHandler()
                }
                canvas.cancelAnimationFrame(render)
                console.log("ani ok")
              }
            }
          } else {
            render = () => {
              if (this.data.count >= step + animationStep/2) {
                ctx.clearRect(0,0,canvas.width, canvas.height)
                /* 绘制彩色圆环进度条  
                注意此处 传参 step 取值范围是0到2，
                所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                */
                this.renderArc(ctx, this.data.count.toFixed(2), 1)
                this.data.count = this.data.count - animationStep
                canvas.requestAnimationFrame(render)
              } else {
                canvas.cancelAnimationFrame(render)
              }
            }
          }
            
          canvas.requestAnimationFrame(render)
        })
  },

    renderArc: function(ctx, step, direction=0) {
      ctx.beginPath(); 
      ctx.arc(110, 110, 100, Math.PI * 4 / 5, step * Math.PI + Math.PI * 4 / 5, false)
      ctx.stroke()
    },

    setHandler: function(handler) {
      if(handler instanceof Function) {
        this.completeHandler = handler
      }
    }
  }
})
