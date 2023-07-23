if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require("bcryptjs")
const Restaurant = require('../../models/restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

const restaurantList = require('../seeds/restaurant.json').results

const SEED_USERS = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "12345678",
    restaurantIndex: [0, 1, 2],
  },
  {
    name: "user2",
    email: "user2@example.com",
    password: "12345678",
    restaurantIndex: [3, 4, 5],
  },
  {
    name: "user3",
    email: "user3@example.com",
    password: "12345678",
    restaurantIndex: [6, 7],
  },
]


db.once("open", () => {

  return Promise.all(

    SEED_USERS.map((user) => {
      const { name, email, password, restaurantIndex } = user
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
        .then((user) => {
          const userId = user._id
          const restaurants = restaurantIndex.map((index) => {
            return { ...restaurantList[index], userId }
          })
          return Restaurant.create(restaurants)
        })
        .catch((error) => console.log(error))
    })
  )
    .then(() => {
      console.log("restaurantSeeder done!")
      process.exit()
    })
    .catch((error) => console.log(error))
})