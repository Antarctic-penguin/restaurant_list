const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  const type = "全部餐廳"
  res.render('index', { restaurants: restaurantList.results, type })
})

app.get('/restaurants/:name', (req, res) => {
  const restaurant = restaurantList.results.find((restaurant) => {
    return restaurant.name === req.params.name
  })
  res.render('show', { restaurant })
})

app.get('/type/:name', (req, res) => {
  const type = req.params.name

  res.render('index', { restaurants, type })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const type = req.query.type

  const restaurantType = restaurantList.results.filter((restaurant) => {
    return restaurant.category === type
  })
  const restaurantKeyWord = restaurantType.filter((restaurant) => {
    return restaurant.name.trim().toLocaleLowerCase().includes(req.query.keyword.trim().toLocaleLowerCase())
  })
  if (restaurantKeyWord.length === 0) {
    res.render('notfound', { keyword, type })
  } else {
    res.render('index', { restaurants: restaurantKeyWord, keyword, type })
  }
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})