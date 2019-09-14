const sha1 = require('sha1');
const rawBody = require('raw-body')
const util = require('./util')
const tpl = require('./tpl')
module.exports = (config, replay) => {
    return async (ctx, next) => {
        const {
            signature,
            timestamp,
            nonce,
            echostr
        } = ctx.query;
        const token = config.wechat.token;
        let arr = [token, timestamp, nonce];
        let authStr = sha1(arr.sort().join(''))
        if (ctx.method === 'GET') {
            if (authStr === signature)
                ctx.body = echostr
            else
                ctx.body = "Failed"
        } else {
            if (authStr !== signature) {
                return ctx.body = "Failed"
            }
            console.log(ctx.req)
            let buffer = await rawBody(ctx.req, {
                length: ctx.length,
                limit: '3mb',
                encoding: ctx.charset
            })
            const content = await util.parseXML(buffer)
            const message = util.formatXML(content).xml
            ctx.weixing = message
            await replay.apply(ctx, [ctx, next])
            const replayBody = ctx.body
            let xml = util.tpl(replayBody, message)
            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    }
}