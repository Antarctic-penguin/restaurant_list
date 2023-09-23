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