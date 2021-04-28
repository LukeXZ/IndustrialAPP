const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutInfo: app.globalData.layoutInfo,
    // SMOTE参数
    inputRatio: 'auto',
    inputKNeighbours: 5,
    smoteOutput: "",
    // GBDT分类算法参数
    inputNEstimators: 100,
    inputLearningRate: 1,
    inputMaxDepth: 3,
    inputMinSamplesLeaf: 1,
    // SVM分类算法参数
    inputDegree: 3,
    inputKernel: 'rbf',
    inputGamma: 'auto',
    inputC: 1.0,
    inputTol: 0.0001,
    // Adaboost分类算法参数
    inputAdaLR: 1,
    inputAdaNE: 50,
    inputBaseEstimator: 'DecisionTreeClassifier',
    inputAdaAlgorithm: 'SAMME',
    inputRandomState: 'None'
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

  dataCleaning: function() {

  },

  submitSmote: function(e) {
    console.log("设定的Ratio: ", e.detail.value.ratio, "设定的KNeighbours: ", e.detail.value.KNeighbours)
    this.setData({
      inputRatio: (e.detail.value.ratio === 'auto')? 'auto' : parseFloat(e.detail.value.ratio),
      inputKNeighbours: parseInt(e.detail.value.KNeighbours)
    })
    return this.fetchSmoteData()
  },

  submitGBDT: function(e) {
    console.log("设定的NEstimators: ", e.detail.value.NEstimators, "设定的LearningRate: ", e.detail.value.LearningRate, "设定的MaxDepth: ", e.detail.value.MaxDepth, "设定的MinSamplesLeaf: ", e.detail.value.MinSamplesLeaf)
    this.setData({
      inputNEstimators: parseInt(e.detail.value.NEstimators),
      inputLearningRate: parseInt(e.detail.value.LearningRate),
      inputMaxDepth: parseInt(e.detail.value.MaxDepth),
      inputMinSamplesLeaf: parseInt(e.detail.value.MinSamplesLeaf)
    })
    return this.fetchGBDTResult()
  },

  submitSVM: function(e) {
    console.log("设定的Degree: ", e.detail.value.Degree, "设定的Kernel: ", e.detail.value.Kernel, "设定的Gamma: ", e.detail.value.Gamma, "设定的C: ", e.detail.value.C, "设定的Tol: ", e.detail.value.Tol)
    this.setData({
      inputDegree: parseInt(e.detail.value.Degree),
      inputKernel: e.detail.value.Kernel,
      inputGamma: (e.detail.value.Gamma == 'auto')? 'auto' : parseFloat(e.detail.value.Gamma),
      inputC: parseFloat(e.detail.value.C),
      inputTol: parseFloat(e.detail.value.Tol)
    })
    return this.fetchSVMResult()
  },

  submitAda: function(e) {
    console.log("设定的LR: ", e.detail.value.AdaLR, "设定的NE: ", e.detail.value.AdaNE, "设定的BaseEstimator: ", e.detail.value.BaseEstimator, "设定的Algorithm: ", e.detail.value.AdaAlgorithm, "设定的RandomState: ", e.detail.value.RandomState)
    this.setData({
      inputAdaLR: parseInt(e.detail.value.AdaLR),
      inputAdaNE: parseInt(e.detail.value.AdaNE),
      inputBaseEstimator: e.detail.value.BaseEstimator,
      inputAdaAlgorithm: e.detail.value.AdaAlgorithm,
      inputRandomState: e.detail.value.RandomState
    })
    return this.fetchAdaResult()
  },

  fetchSmoteData: function() {
    if(!app.globalData.token) {
      return
    }
    wx.showLoading({
      title: 'Smote预处理中...',
    })
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://phmlearn.com/component/pre/smote',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          access_token: app.globalData.token,
          ratio: this.data.inputRatio,
          k_neighbors: this.data.inputKNeighbours,
          file_name: "data_41171444316823199.csv"
        },
        success(res) {
          if(res.data.success) {
            console.log("数据集处理完成！")
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '数据集处理完成！',
              duration: 1000
            })
            that.setData({
              smoteOutput: res.data.data.file_name
            })
            resolve()
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },

  fetchGBDTResult: function() {
    if(!app.globalData.token) {
      return
    }
    wx.showLoading({
      title: 'GBDT分类中...',
    })
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://phmlearn.com/component/ML/classify/7',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          access_token: app.globalData.token,
          n_estimators: this.data.inputNEstimators,
          learning_rate: this.data.inputLearningRate,
          max_depth: this.data.inputMaxDepth,
          min_samples_leaf: this.data.inputMinSamplesLeaf,
          file_name: this.data.smoteOutput
        },
        success(res) {
          if(res.data.success) {
            console.log("GBDT分类完成！")
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: 'GBDT分类完成！',
              duration: 1000
            })
            that.setData({
              GBDTOutput: res.data.data
            })
            app.globalData.GBDTOutput = res.data.data
            resolve()
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },

  fetchSVMResult: function() {
    if(!app.globalData.token) {
      return
    }
    let that = this
    wx.showLoading({
      title: 'SVM分类中...',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://phmlearn.com/component/ML/classify/13',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          access_token: app.globalData.token,
          degree: this.data.inputDegree,
          kernel: this.data.inputKernel,
          gamma: this.data.inputGamma,
          C: this.data.inputC,
          tol: this.data.inputTol,
          file_name: this.data.smoteOutput
        },
        success(res) {
          if(res.data.success) {
            console.log("SVM分类完成！")
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: 'SVM分类完成！',
              duration: 1000
            })
            that.setData({
              SVMOutput: res.data.data
            })
            app.globalData.SVMOutput = res.data.data
            resolve()
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },

  fetchAdaResult: function() {
    if(!app.globalData.token) {
      return
    }
    let that = this
    wx.showLoading({
      title: 'Ada分类中...',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://phmlearn.com/component/upload/ML/3/249',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          access_token: app.globalData.token,
          file_name: this.data.smoteOutput,
          learning_rate: this.data.inputAdaLR,
          n_estimators: this.data.inputAdaNE,
          base_estimator: this.data.inputBaseEstimator,
          algorithm: this.data.inputAdaAlgorithm,
          random_state: this.data.inputRandomState
        },
        success(res) {
          if(res.data.success) {
            console.log("Ada分类完成！")
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: 'Ada分类完成！',
              duration: 1000
            })
            that.setData({
              AdaOutput: res.data.data
            })
            app.globalData.AdaOutput = res.data.data
            resolve()
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },

  showNumbers: function(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/dataResult/dataResult?type=' + type,
    })
  },

  compareNumbers: function() {
    wx.navigateTo({
      url: '/pages/dataResult/dataResult?compare=1',
    })
  }
})