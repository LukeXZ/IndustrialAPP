import {colorArr} from '../../utils/layout'
const db = wx.cloud.database() // 获取云开发数据库实例

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    colorArr: colorArr
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
