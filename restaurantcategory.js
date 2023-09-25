const restaurantList = require('./models/restaurant')

function getCategory() {
  return restaurantList.find()
    .lean()
    .then(restaurantList => {
      const restaurantCategories = []
      restaurantList.forEach((item) => {
        restaurantCategories.push(item.category)
      })
      const restaurantCategory = restaurantCategories.filter((element, index, arr) => {
        return arr.indexOf(element) === index;
      })
      return restaurantCategory
    })
}
module.exports = {
  getCategory
}