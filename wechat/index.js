const config = require('../config/config')
const weChat = require('../wechat-lib/index')
const WebChatOAuth = require('../wechat-lib/oauth')
const Token = require('../app/database/schema/token')
const Ticket = require('../app/database/schema/ticket')
const weChatConfig = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appsecret,
        token: config.wechat.token
    },
    getAccessToken: async () => {
        const res = await Token.getAccessToken()
        return res
    },
    setAccessToken: async (data) => {
        const res = await Token.setAccessToken(data)
        return res
    },
    getTicket: async () => {
        const res = await Ticket.getTicket()
        return res
    },
    setTicket: async (data) => {
        const res = await Ticket.setTicket(data)
        return res
    }
}

exports.getWechat = () => new weChat(weChatConfig)
exports.getOAuth = () => new WebChatOAuth(weChatConfig)