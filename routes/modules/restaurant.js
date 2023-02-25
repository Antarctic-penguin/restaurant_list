const express = require('express')        // 引用 Express 與 Express 路由器
const router = express.Router()          // 準備引入路由模組
const restaurantList = require('../../models/restaurant')
const restaurantCategory = require('../../restaurantcategory')

// 餐廳詳細頁面
router.get('/restaurants/details/:name', (req, res) => {
  restaurantList.find({ name: req.params.name })
    .lean()
    .then(restaurant => res.render('show', { restaurant: restaurant[0] }))
    .catch(error => console.error(error))
})

// 搜尋餐廳
router.get('/search/:sort', (req, res) => {
  let sort = req.params.sort
  const sortRoute = req.params.sort
  const keyword = req.query.keyword
  const type = req.query.type
  const typeRoute = req.query.type
  const keywordRoute = req.query.keyword
  let restaurantType = restaurantList.find({ category: type }).lean()
  if (type === '全部餐廳') {
    restaurantType = restaurantList.find().lean()
  }
  if (sortRoute === 'A->Z') {
    restaurantType = restaurantType.sort({ name: 'asc' })
  } else if (sortRoute === 'Z->A') {
    restaurantType = restaurantType.sort({ name: 'desc' })
  } else if (sortRoute === '評分高->低') {
    restaurantType = restaurantType.sort({ rating: 'desc' })
  } else if (sortRoute === '評分低->高') {
    restaurantType = restaurantType.sort({ rating: 'asc' })
  }
  restaurantType
    .lean()
    .then(restaurantType => {
      if (sort === 'notSort') {
        sort = ''
      }
      const restaurants = restaurantType.filter((restaurant) => {
        return restaurant.name.trim().toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase())
      })
      if (restaurants.length === 0) {
        res.render('notfound', { keyword, type, restaurantCategory: restaurantCategory.category, sortRoute })
      } else {
        res.render('index', { sort, restaurants, keyword, type, restaurantCategory: restaurantCategory.category, sortRoute, typeRoute, keywordRoute })
      }
    })
    .catch(error => console.error(error))
})
// 排序
router.get('/sort/:keyword/:type', (req, res) => {
  let sort = req.query.sort
  const sortRoute = req.query.sort
  let keyword = req.params.keyword
  const keywordRoute = req.params.keyword
  const type = req.params.type
  const typeRoute = req.params.type
  let restaurantType = restaurantList.find({ category: type }).lean()
  if (type === '全部餐廳') {
    restaurantType = restaurantList.find().lean()
  }
  if (sortRoute === 'A->Z') {
    restaurantType = restaurantType.sort({ name: 'asc' })
  } else if (sortRoute === 'Z->A') {
    restaurantType = restaurantType.sort({ name: 'desc' })
  } else if (sortRoute === '評分高->低') {
    restaurantType = restaurantType.sort({ rating: 'desc' })
  } else if (sortRoute === '評分低->高') {
    restaurantType = restaurantType.sort({ rating: 'asc' })
  }
  restaurantType
    .lean()
    .then(restaurantType => {
      let restaurants = restaurantType
      if (keywordRoute !== 'notKeyWord') {
        restaurants = restaurantType.filter((restaurant) => {
          return restaurant.name.trim().toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase())
        })
      } else {
        keyword = ''
      }
      if (restaurants.length === 0) {
        res.render('notfound', { sortRoute, keyword, type, restaurantCategory: restaurantCategory.category })
      } else {
        res.render('index', { sort, sortRoute, keyword, restaurants, type, restaurantCategory: restaurantCategory.category, typeRoute, keywordRoute })
      }
    })
    .catch(error => console.error(error))
})

// 新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new', { restaurantCategory: restaurantCategory.category })
})
// 新增餐廳路由
router.post('/', (req, res) => {
  let { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  // 勾選沒有圖片的
  if (req.body.notPicture === 'on') {
    image = 'https://fakeimg.pl/550x410/?text=not%20pictured'
  }
  restaurantList.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))

})
// 編輯餐廳頁面
router.get('/edit/:name', (req, res) => {
  restaurantList.find({ name: req.params.name })
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant[0] }))
    .catch(error => console.error(error))
})
// 編輯餐廳路由
router.put('/:id', (req, res) => {
  restaurantList.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.redirect(`/restaurants/details/${req.body.name}`))
    .catch(err => console.log(err))
})
// 刪除餐廳路由
router.delete('/:id', (req, res) => {
  restaurantList.findById(req.params.id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router

