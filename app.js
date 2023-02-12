const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  const type = '餐廳種類'
  res.render('index', { restaurant: restaurantList.results, type })
})

app.get('/restaurants/:name', (req, res) => {
  const restaurant = restaurantList.results.find((restaurant) => {
    return restaurant.name === req.params.name
  })
  res.render('show', { restaurant })
})

app.get('/type/:name', (req, res) => {
  const type = req.params.name
  const restaurant = restaurantList.results.filter((restaurant) => {
    return restaurant.category === req.params.name
  })
  res.render('index', { restaurant, type })
})

app.get('/search', (req, res) => {
  const type = '餐廳種類'
  const keyword = req.query.keyword.trim()
  const restaurant = restaurantList.results.filter((restaurant) => {
    return restaurant.name.trim().toLocaleLowerCase().includes(req.query.keyword.trim().toLocaleLowerCase())
  })
  if (restaurant.length === 0) {
    res.render('notfound', { keyword, type })
  } else {
    res.render('index', { restaurant, keyword, type })
  }
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})