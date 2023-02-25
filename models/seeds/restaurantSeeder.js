const db = require('../../config/mongoose')
const restaurant = require('../restaurant') // 載入 todo model
const restaurantList = require('../../restaurant.json')
db.once('open', () => {
  restaurantList.results.forEach((item) => {
    restaurant.create({
      name: item.name,
      name_en: item.name_en,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone,
      google_map: item.google_map,
      rating: item.rating,
      description: item.description,
    })
  })
  console.log('mongodb connected!')
})
