const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()

router.get('/', async (ctx) => {
  ctx.body = '这是用户操作首页'
})

router.post('/register', async (ctx) => {
  console.log('/register', ctx.request)
  const User = mongoose.model('User')
  let newUser = new User(ctx.request.body)

  await newUser.save()
    .then(() => {
      ctx.body = {
        code: 200,
        message: '注册成功'
      }
    })
    .catch(err => {
      ctx.body = {
        code: 500,
        message: err
      }
    })
})

router.post('/login', async (ctx) => {
  let loginUser = ctx.request.body
  console.log('loginUser***', loginUser)
  let userName = loginUser.userName
  let password = loginUser.password
  const User = mongoose.model('User')
  await User.findOne({userName: userName}).exec()
    .then(async (result) => {
      console.log(result, '----result---')
      if (result) {
        let newUser = new User()
        await newUser.comparePwd(password, result.password)
          .then(isMatch => {
            ctx.body = { code: 200, message: isMatch }
          })
          .catch(err => {
            console.log(err)
            ctx.body = { code: 500, message: error }
          })
      } else {
        ctx.body = { code: 200, message: '用户名不存在' }
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = { code: 500, message: err }
    })
})

module.exports = router
