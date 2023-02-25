const express = require('express')
const router = express.Router()
const restaurant = require('../../models/restaurant')
const restaurantCategory = require('../../restaurantcategory')

//餐廳主頁面 
router.get('/', (req, res) => {
  const type = "全部餐廳"
  const typeRoute = '全部餐廳'
  const sortRoute = "notSort"
  const keywordRoute = 'notKeyWord'
  restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants, type, restaurantCategory: restaurantCategory.category, sortRoute, keywordRoute, typeRoute }))
    .catch(error => console.error(error))
})

module.exports = router