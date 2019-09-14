const Koa = require('koa');
const config = require('./config/config')
const views = require('koa-views')
const path = require('path')
const moment = require('moment')
const {initSchemas,connect} = require('./app/database/init')
const Router = require('koa-router')
const bodyParse = require('koa-bodyParser')
const session = require('koa-session')
const RouterFuc = require('./config/routers')
const User = require('./app/database/schema/user')
const serve = require('koa-static')
const wechatController = require('./app/controller/wechat')

;(async () => {
await connect(config.db)
// 引入所有model
initSchemas()
const app = new Koa();
//设置秘钥进行加密
app.keys = ['imooc']
app.use(bodyParse())
app.use(session(app))
app.use(serve('./public/'))
const router = new Router()
app.use(views(path.resolve(__dirname,'./app/views'),{
    extension: 'pug',
    options: {
        moment: moment
    }
}))
app.use(wechatController.checkWechat)
app.use(wechatController.wechatRedirect)
app.use(async (ctx,next) => {
    let user = ctx.session.user
    if (user && user._id) {
        user = await User.findOne({_id: user._id})
        if (user) {
            ctx.session.user = {
                _id: user._id,
                role: user.role,
                nickname: user.nickname,
            }
            //更新state，使pug能够渲染
            //为什么每次不用请求也能拿到user
            ctx.state = Object.assign(ctx.state,{user:ctx.session.user})
        }
    } else {
        ctx.session.user = null
    }
    console.log('***************78964')
    console.log(ctx.session.user)
    await next()
})
RouterFuc(router)
app.use(router.routes()).use(router.allowedMethods())
app.listen(config.port,() => console.log(`sever is running on port ${config.port}`))
})()