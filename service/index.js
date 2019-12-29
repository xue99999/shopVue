const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
let mongoose = require('mongoose')
const cors = require('koa2-cors')
const app = new Koa()
const {connect, initSchemes} = require('./database/init')

app.use(bodyParser())
app.use(cors())

;(async () => {
  await connect()
  initSchemes()
  // const Goods = mongoose.model('Goods')
  // let result = await Goods.find().exec()
  // console.log('result-----', result)
})()


let user = require('./appApi/user')
let goods = require('./appApi/goods')
// 装载所有子路由
let router = new Router()
router.use('/user', user.routes())
router.use('/goods', goods.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('[Server] starting at port 3000')
})
