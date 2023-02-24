const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const restaurantList = require('./models/restaurant')
const restaurantCategory = require('./restaurantcategory.js')
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//餐廳主頁面 
app.get('/', (req, res) => {
  const type = "全部餐廳"
  restaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants, type, restaurantCategory: restaurantCategory.category }))
    .catch(error => console.error(error))
})
// 餐廳詳細頁面
app.get('/restaurants/details/:name', (req, res) => {
  restaurantList.find({ name: req.params.name })
    .lean()
    .then(restaurant => res.render('show', { restaurant: restaurant[0] }))
    .catch(error => console.error(error))
})
// 搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const type = req.query.type
  const search = true
  let restaurantType = restaurantList.find({ category: type })
  if (type === '全部餐廳') {
    restaurantType = restaurantList.find()
  }
  restaurantType
    .lean()
    .then(restaurantType => {
      const restaurantKeyWord = restaurantType.filter((restaurant) => {
        return restaurant.name.trim().toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      })
      if (restaurantKeyWord.length === 0) {
        res.render('notfound', { keyword, type, restaurantCategory: restaurantCategory.category })
      } else {
        res.render('index', { restaurants: restaurantKeyWord, keyword, type, restaurantCategory: restaurantCategory.category, search })
      }
    })
    .catch(error => console.error(error))
})

app.get('/sort', (req, res) => {
  const sort = req.query.sort
  const type = '全部餐廳'
  let restaurants = restaurantList.find().lean()
  if (sort === 'A->Z') {
    restaurants = restaurants.sort({ name: 'asc' })
  } else if (sort === 'Z->A') {
    restaurants = restaurants.sort({ name: 'desc' })
  } else if (sort === '評分高->低') {
    restaurants = restaurants.sort({ rating: 'desc' })
  } else if (sort === '評分低->高') {
    restaurants = restaurants.sort({ rating: 'asc' })
  }
  restaurants.lean()
    .then(restaurants => {
      res.render('index', { restaurants, type, restaurantCategory: restaurantCategory.category, sort })
    })
    .catch(error => console.error(error))
})

// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new', { restaurantCategory: restaurantCategory.category })
})
// 新增餐廳路由
app.post('/restaurants', (req, res) => {
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
app.get('/restaurants/edit/:name', (req, res) => {
  restaurantList.find({ name: req.params.name })
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant[0] }))
    .catch(error => console.error(error))
})
// 編輯餐廳路由
app.put('/restaurants/:id', (req, res) => {
  restaurantList.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.redirect(`/restaurants/details/${req.body.name}`))
    .catch(err => console.log(err))
})
// 刪除餐廳路由
app.delete('/restaurants/:id', (req, res) => {
  restaurantList.findById(req.params.id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})