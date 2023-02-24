const mongoose = require('mongoose')
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })// 設定連線到 mongoDB
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
const restaurantList = require('./models/restaurant')
restaurantList.find()
  .lean()
  .then(restaurantList => {
    const restaurantCategories = []
    restaurantList.forEach((item) => {
      restaurantCategories.push(item.category)
    })
    const restaurantCategory = restaurantCategories.filter((element, index, arr) => {
      return arr.indexOf(element) === index;
    })
    module.exports.category = restaurantCategory
  })