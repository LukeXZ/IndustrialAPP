// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let data = (await db.collection("work_order_history").get()).data
  let processed = {}
  for(let index in data) {
    let day = data[index].timestamp.slice(0,9)
    if(processed.hasOwnProperty(day)) {
      processed[day]++
    } else {
      processed[day] = 1
    }
  }
  let res = (await db.collection("work_order_history").where({
    judgement: true
  }).get()).data
  let malfunction = {}
  for(let index in res) {
    let day = res[index].timestamp.slice(0,9)
    if(malfunction.hasOwnProperty(day)) {
      malfunction[day]++
    } else {
      malfunction[day] = 1
    }
  }
  return {processed: processed, malfunction: malfunction}
}