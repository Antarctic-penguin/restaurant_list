const express = require('express')
const router = express.Router()
const restaurant = require('../../models/restaurant')
const { getCategory } = require('../../restaurantcategory');
let restaurantCategory = []

//餐廳主頁面 
router.get('/', (req, res) => {
  const type = "全部餐廳"
  const typeRoute = '全部餐廳'
  const sortRoute = "notSort"
  const keywordRoute = 'notKeyWord'
  const userId = req.user._id
  getCategory()
    .then(categories=>{
      restaurantCategory = categories
      return restaurant.find({ userId }).lean();
    })
    .then(restaurants => res.render('index', { restaurants, type, restaurantCategory, sortRoute, keywordRoute, typeRoute }))
    .catch(error => console.error(error))
})

module.exports = router