const express = require('express')
const router = express.Router()
const User = require('../../models/user')

// 登錄頁
router.get('/login', (req, res) => {
  res.render('login')
})
// 登錄路由
router.post('/login', (req, res) => {
})
// 註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})
// 註冊路由
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email }).then(user => {
    if (user) {
      res.render('register', { name, email, password, confirmPassword })
    } else {
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
    .catch(err => console.log(err))
})
module.exports = router