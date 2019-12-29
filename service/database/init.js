const { resolve } = require('path')
const glob = require('glob')
const mongoose = require('mongoose')
const db = "mongodb://localhost/shop"

mongoose.Promise = global.Promise

exports.connect = () => {
  mongoose.connect(db)
  // 最大连接次数
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {

    //增加数据库连接的事件监听
    mongoose.connection.on('disconnected',()=>{
        //进行重连
        if (maxConnectTimes < 3) {
          maxConnectTimes++
          mongoose.connect(db)
        } else {
          reject()
          throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
        }
    })

    //数据库出现错误的时候
    mongoose.connection.on('error',err=>{
        console.log(err)
        if (maxConnectTimes < 3) {
          maxConnectTimes++
          mongoose.connect(db)
        } else {
          reject()
          throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
        }
    })

    //链接打开的时候
    mongoose.connection.once('open',()=>{
        console.log('MongoDB Connected successfully!')
        resolve()
    })
  })
}

// 初始化所有schema
exports.initSchemes = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
