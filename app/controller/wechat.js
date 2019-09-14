const {
    replay
} = require('../../wechat/replay')
const wechatMiddle = require('../../wechat-lib/middleware')
const {
    getOAuth
} = require('../../wechat/index')
const config = require('../../config/config')
const api = require('../api/index')

// 消息中间件(自动回复，菜单处理)
exports.hear = async (ctx, next) => {
    //拿到执行的函数，由于该异步函数要用到config用来校验,replay用于请求处理回复所以传入
    const middle = wechatMiddle(config, replay)
    //调用该方法
    await middle(ctx, next)
}
exports.oauth = async (ctx, next) => {
    let oauth = getOAuth()
    let state = ctx.query.id
    let target = config.base + '/getUserInfo'
    let scope = 'snsapi_userinfo'
    //穿好参数链接到授权页面
    let url = oauth.getAuthorizeURL(scope, target, state)
    ctx.redirect(url)
}

//授权页面确认按钮默认跳转redirect_uri/?code=CODE&state=STATE，所以这个方法对应路由是上面传递的target即可
//code也可以用query拿到
exports.userInfo = async (ctx, next) => {
    let oauth = getOAuth()
    let code = ctx.query.code
    let tokenData = await oauth.fetchAccessToken(code)
    let UserData = await oauth.fetchUserInfo(tokenData.access_token, tokenData.openid)
    ctx.body = UserData
}
exports.sdk = async (ctx, next) => {
    let url = ctx.href
    let params = await api.wechat.signature(url)
    console.log(params)
    await ctx.render('./wechat/sdk.pug', params)
}

function isWechat(ua) {
    return ua.indexOf('MicroMessenger') > -1
}


exports.checkWechat = async (ctx, next) => {
    let ua = ctx.headers['user-agent']
    let code = ctx.query.code
    if (ctx.method === 'GET') {
        console.log(1)
        if (code) {
            console.log(2)
            await next()
        } else if (isWechat(ua)) {
            console.log(3)
            const target = ctx.href
            const scope = 'snsapi_userinfo'
            let url = api.wechat.getAuthorizeURL(scope, target, 'fromWechat')
            ctx.redirect(url)
        } else {
            console.log(4)

            await next()
        }
    } else {
        console.log(5)

        await next()
    }
}

exports.wechatRedirect = async (ctx, next) => {
    let {
        code,
        state
    } = ctx.query
    if (code && state === 'fromWechat') {
        let userData = await api.wechat.getUserInfoByCode(code)
        let user = await api.wechat.saveWechatUser(userData)
        ctx.session.user = {
            _id: user._id,
            role: user.role,
            nickname: user.nickname
        }
        Object.assign(ctx.state, {
            user
        })
        console.log('111111111111111111')
        console.log(ctx.session)
    }
    await next()
}

exports.getSDKSignature = async (ctx, next) => {
    let url = ctx.query.url
    url = decodeURIComponent(url)
    let params = await api.wechat.signature(url)
    ctx.body = {
        success: true,
        data: params
    }

}