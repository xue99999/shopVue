const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')

const app = new Koa()
let router = new Router()

router.get('/insertAllGoodsInfo', async (ctx) => {
  fs.readFile('./data_json/goods.json', 'utf8', (err, data) => {
    data = data && JSON.parse(data)
    let saveCount = 0
    const Goods = mongoose.model('Goods')
    console.log('data.RECORDS------', data.RECORDS.length)
    data.RECORDS.map((val, index) => {
      console.log(index)
      let newGoods = new Goods(val)
      newGoods.save()
        .then(() => {
          saveCount++
          console.log('成功', saveCount)
          if (data.RECORDS.length === saveCount) {
            console.log('全部数据导入完毕, 一共' + saveCount + '条数据')
          }
        })
        .catch(err => {
          console.error('失败', err)
        })
    })
  })

  ctx.body = '开始导入Goods'
})


router.get('/insertAllCategory', async (ctx) => {

  fs.readFile('./data_json/category.json', 'utf8', (err, data) => {
    data = data && JSON.parse(data)
    let saveCount = 0

    const Category = mongoose.model('Category')

    data.RECORDS.map((val, idx) => {
      let newCategory = new Category(val)
      newCategory.save()
        .then(() => {
          saveCount++
          console.log('成功', saveCount)
          if (data.RECORDS.length === saveCount) {
            console.log('全部数据导入完毕, 一共' + saveCount + '条数据')
          }
        })
        .catch(err => {
          console.error('失败', err)
        })
    })
  })

  ctx.body = '开始导入Category'
})


router.get('/insertAllCategorySub', async (ctx) => {

  fs.readFile('./data_json/category_sub.json', 'utf8', (err, data) => {
    data = data && JSON.parse(data)
    let saveCount = 0

    const CategorySub = mongoose.model('CategorySub')

    data.RECORDS.map((val, idx) => {
      let categorySub = new CategorySub(val)
      categorySub.save()
        .then(async () => {
          saveCount++
          console.log('成功', saveCount)
          if (data.RECORDS.length === saveCount) {
            console.log('全部数据导入完毕, 一共' + saveCount + '条数据')
            let result = await CategorySub.find().exec()
            console.log('result--', result.length)
          }
        })
        .catch(err => {
          console.error('失败', err)
        })
    })
  })

  ctx.body = '开始导入Category'
})

router.post('/getDetailGoodsInfo', async (ctx) => {
  console.log('getDetailGoodsInfo--ctx.request.body---', ctx.request.body)
  try {
    let {goodsId} = ctx.request.body
    const Goods = mongoose.model('Goods')
    let result = await Goods.findOne({ID: goodsId}).exec()
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.get('/getCategoryList', async (ctx) => {
  try {
    const Category = mongoose.model('Category')
    let result = await Category.find().exec()
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getCategorySubList', async (ctx) => {
  try {
    let {categoryId} = ctx.request.body
    const CategorySub = mongoose.model('CategorySub')
    let result = await CategorySub.find({MALL_CATEGORY_ID: categoryId}).exec()
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getGoodsListByCategorySubID', async (ctx) => {
  try {
    let {categorySubId, page} = ctx.request.body
    let num = 10
    let start = (page - 1) * 10

    const Goods = mongoose.model('Goods')
    let result = await Goods.find({SUB_ID: categorySubId})
      .skip(start).limit(num).exec()
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router
