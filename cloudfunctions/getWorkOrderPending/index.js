// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {order} = event
  if(order == 1) {
    return db.collection("work_order_pending").orderBy("level", "asc").orderBy("timestamp", "desc").get()
  } else {
    return db.collection("work_order_pending").orderBy("timestamp", "desc").get()
  }
}