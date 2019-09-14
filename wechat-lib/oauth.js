const requestPromise = require('request-promise')
const base = 'https://api.weixin.qq.com/sns/'
const api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: base + 'oauth2/access_token?',
    userInfo: base + 'userinfo?'
}

module.exports = class WebChatOAuth {
    constructor(opts) {
        this.appID = opts.wechat.appID
        this.appSecret = opts.wechat.appSecret
    }

    async request(opts) {
        Object.assign(opts, {
            json: true
        })
        try {
            let data = await requestPromise(opts)
            return data
        } catch (e) {
            console.log(e)
        }
    }
    //snsapi_base 默认授权，只会拿到openId
    //snsapi_userinfo 弹框手动授权，会拿到昵称等你其他详细信息
    getAuthorizeURL(scope = 'snsapi_userinfo', target, state) {
        let url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
        return url
    }

    async fetchAccessToken(code) {
        let url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
        const res = await this.request({
            url
        })
        return res
    }

    async fetchUserInfo(token, openId, lang = 'zh-CN') {
        let url = `${api.userInfo}access_token=${token}&openid=${openId}&lang=${lang}`
        const res = await this.request({
            url
        })
        return res
    }

}