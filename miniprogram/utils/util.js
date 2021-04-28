class Cycle {
  constructor(array, handler, stopHandler) {
    this.interval = null
    this.array = array
    if(typeof handler === 'function') {
      this.handler = handler
    }
    if(typeof stopHandler === 'function') {
      this.stopHandler = stopHandler
    }
  }

  startCycle() {
    if(this.interval) {
      console.log("interval cleared")
      clearInterval(this.interval)
      this.interval = null
    }
    let index = 0
    if(typeof(this.handler) !== 'function') {
      console.log("初始化错误！")
      return
    }
    this.interval = setInterval(() => {
      if(index <= this.array.length) {
        if(index + 10 > this.array.length) {
          let temp = this.array.slice(index, this.array.length - 1)
          index += 10
          this.handler(temp)
        }
        let temp = this.array.slice(index, index + 10)
        index += 10
        this.handler(temp)
      } else {
        index = 0
      }
    }, 2000);
    console.log(this.interval, "cycling")
  }

  startSingleCycle() {
    if(this.interval) {
      console.log("single interval cleared")
      clearInterval(this.interval)
      this.interval = null
    }
    let index = 0
    if(typeof(this.handler) !== 'function') {
      console.log("初始化错误！")
      return
    }
    this.interval = setInterval(() => {
      if(index <= this.array.length - 1) {
        this.handler(this.array[index])
        index++
      } else {
        index = 0
      }
    }, 500);
    console.log(this.interval, "cycling")
  }

  stopCycle() {
    clearInterval(this.interval)
    if(typeof(this.stopHandler) === 'function') {
      this.stopHandler()
    }
    console.log(this.interval, "interval cleared")
    this.interval = null
  }
}

export {Cycle}