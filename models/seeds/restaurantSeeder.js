const mongoose = require('mongoose')
const restaurant = require('../restaurant') // 載入 todo model
const restaurantList = require('../../restaurant.json')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
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
