const {resolve} = require('path')
const isProd = process.NODE_ENV === 'production'


module.exports 
let cfg = {
    "port": 3000,
    "db": "mongodb://localhost/wehcat7days",
    "wechat": {
        "appID": "wx9a5ae39ece420bfa",
        "appsecret": "6026d026d57eba1055bf8038d6b2d254",
        "token": "fate"
    },
    "base": "http://pxk.free.idcfengye.com"
}
//运行到服务器中开启
// if (cfg) {
//     const config = require(resolve(__dirname,'../../../../config/config.json'))
//     cfg = Object.assign(cfg,config)
// }

module.exports = cfg