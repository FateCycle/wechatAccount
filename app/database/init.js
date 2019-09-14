const mongoose = require('mongoose')
const {
    resolve
} = require('path')
const glob = require('glob')

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = (db) => {
    return new Promise(resolve => {
        //if (process.env.NODE_ENV !== 'production') mongoose.set('debug', true)
        let maxConnectTime = 0
        mongoose.connect(db, {
            useNewUrlParser: true
        })
        mongoose.connection.on('disconnected', () => {
            maxConnectTime++
            if (maxConnectTime < 5) {
                mongoose.connect(db, {
                    useNewUrlParser: true
                })
            } else {
                throw Error('数据库失联了')
            }
        })
        mongoose.connection.on('error', () => {
            maxConnectTime++
            if (maxConnectTime < 5) {
                mongoose.connect(db, {
                    useNewUrlParser: true
                })
            } else {
                throw Error('数据库出错了')
            }
        })
        mongoose.connection.on('open', () => {
            resolve()
            console.log('数据库连接成功')
        })
    })
}