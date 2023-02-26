const db = require('../../config/mongoose')
const restaurant = require('../restaurant') // 載入 todo model
const restaurantList = require('../../restaurant.json')
db.once('open', () => {
  // Model.create()  是可以傳 Array 進去的，所以在產生種子資料的時候可以直接將 restaurantList.results 傳入 Restaurant.create 中
  restaurant.create(restaurantList.results)
  // restaurantList.results.forEach((item) => {
  //   restaurant.create({
  //     name: item.name,
  //     name_en: item.name_en,
  //     category: item.category,
  //     image: item.image,
  //     location: item.location,
  //     phone: item.phone,
  //     google_map: item.google_map,
  //     rating: item.rating,
  //     description: item.description,
  //   })
  // })
  console.log('mongodb connected!')
})
