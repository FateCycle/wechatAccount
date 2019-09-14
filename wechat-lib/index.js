const fs = require('fs')
const requestPromise = require('request-promise')
const base = "https://api.weixin.qq.com/cgi-bin/"
const mpBase = "https://mp.weixin.qq.com/cgi-bin/"
const smBase = "https://api.weixin.qq.com/semantic/semproxy/"
const api = {
    "semantic": smBase + 'search?',
    "accessToken": base + 'token?grant_type=client_credential',
    "clean": base + 'clear_quota?',
    "temporary": {
        upload: base + "media/upload?",
        fetch: base + "media/get?",
    },
    "permanent": {
        upload: base + "material/add_material?",
        uploadNews: base + "material/add_news?",
        uploadNewssPic: base + "media/uploadimg?",
        fetch: base + "material/get_material?",
        del: base + "material/del_material?",
        update: base + "material/update_news?",
        count: base + "material/get_materialcount?",
        batch: base + "material/batchget_material?"
    },
    "tag": {
        create: base + "tags/create?",
        fetch: base + "tags/get?",
        update: base + "tags/update?",
        delete: base + "tags/delete?",
        fetchUser: base + "user/tag/get?",
        batchTag: base + "tags/members/batchtagging?",
        batchUnTag: base + "tags/members/batchuntagging?",
        getUserTags: base + "tags/getidlist?"
    },
    "user": {
        fetch: base + "user/get?",
        mark: base + "user/info/updateremark?",
        info: base + "user/info?",
        batch: base + "user/info/batchget?"
    },
    "qrcodee": {
        create: base + "qrcode/create?",
        show: mpBase + 'showqrcode?'
    },
    "shortUrl": {
        create: base + "shorturl?"
    },
    "ai": {
        translate: base.replace('https', 'http') + "/media/voice/translatecontent?"
    },
    "menu": {
        create: base + 'menu/create?',
        delete: base + 'menu/delete?',
        custom: base + 'menu/addconditional?',
        fetch: base + 'menu/get?',
        fetchCustom: base + 'get_current_selfmenu_info?'
    },
    "ticket": {
        get: base + "ticket/getticket?"
    }

}
module.exports = class WeChat {
    constructor(opts) {
        this.appID = opts.wechat.appID
        this.appSecret = opts.wechat.appSecret
        this.getAccessToken = opts.getAccessToken
        this.setAccessToken = opts.setAccessToken
        this.getTicket = opts.getTicket
        this.setTicket = opts.setTicket
        this.fetchAccessToken()
    }

    //发送请求得到accessToken
    async request(opts) {
        opts = Object.assign({}, opts, {
            json: true
        })
        try {
            let data = await requestPromise(opts)
            return data
        } catch (err) {
            console.log(err)
        }
    }

    async fetchAccessToken() {
        if (this.getAccessToken) {
            data = await this.getAccessToken()
        }
        //data为空或者过期进行更新
        if (!this.isValid(data)) {
            data = await this.updateAccessToken()
        }
        await this.setAccessToken(data)
        return data
    }

    //拿到AccessToken并修改过期时间（提早20s）
    async updateAccessToken() {
        let url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
        const data = await this.request({
            url
        })
        const now = new Date().getTime()
        const expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in
        return data
    }

    async fetchTicket(token) {
        let data
        if (this.getTicket) {
            data = await this.getTicket()
        }
        if (!this.isValid(data)) {
            data = await this.updateTicket(token)
        }
        this.setTicket(data)
        return data
    }

    async updateTicket(token) {
        let url = `${api.ticket.get}access_token=${token}&type=jsapi`
        let data = await this.request({
            url
        })
        const now = new Date().getTime()
        const expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in
        return data
    }

    isValid(data) {
        //所得accessToken为空
        if (!data || !data.expires_in) {
            return false
        }
        //检测accessToken是否过期
        let now = new Date().getTime()
        let expireIn = data.expires_in
        if (expireIn > now) {
            return true
        } else {
            return false
        }
    }

    uploadMaterial(token, type, material, permanent = false) {
        let form = {}
        let options = {}
        let url = api.temporary.upload
        if (permanent) {
            url = api.permanent.upload
            //permanent有值代表他不为空那么这是它就可以作为material的补充数据
            Object.assign(form, permanent)
        }
        if (type === 'pics') {
            url = api.permanent.uploadNewssPic
        }
        if (type === 'news') {
            url = api.permanent.uploadNews
            form = material
        } else {
            form.media = fs.createReadStream(material)
        }
        url = url + "access_token=" + token
        //图文是放在body里的，不是的话是放在formData里的
        if (type !== 'news') {
            options.formData = form
            if (type !== 'pics') {
                url = url + "&type=" + type
                form.type = type
                form.access_token = token
            } else
                form.access_token = token
        } else {
            options.body = form
        }
        Object.assign(options, {
            url,
            method: 'POST',
            json: true
        })
        return options
    }

    async handle(operations, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operations](tokenData.access_token, ...args)
        const data = await this.request(options)
        return data
    }

    fetchMaterial(token, mediaId, type, permanent) {
        let url = api.temporary.fetch
        if (permanent) {
            url = api.permanent.fetch
        }
        url = url + 'access_token=' + token
        let options = {
            method: 'POST',
            url
        }
        if (permanent) {
            options.body = {
                media_id: mediaId,
                access_token: token
            }
        } else {
            if (type === 'video') {
                url = url.replace('https', 'http')
            }
            url += "&media_id=" + mediaId
            options.method = 'GET'
        }
        return options
    }

    deleteMaterial(token, mediaId) {
        let url = api.permanent.del + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                media_id: mediaId,
                access_token: token
            }
        }
    }

    editMaterial(token, mediaId, news) {
        let form = {
            media_id: mediaId,
            access_token: token
        }
        form = Object.assign(form, news)
        let url = api.permanent.update + "access_token=" + token + "&media_id=" + mediaId
        console.log(form)
        console.log(url)
        return {
            method: 'POST',
            url,
            body: form
        }
    }
    countMaterial(token) {
        let url = api.permanent.count + "access_token=" + token
        return {
            method: 'GET',
            url,
        }
    }
    batchMaterial(token, options) {
        let url = api.permanent.batch + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: options
        }
    }
    createTag(token, name) {
        let url = api.tag.create + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                tag: {
                    name
                }
            }
        }
    }
    fetchTag(token) {
        let url = api.tag.fetch + "access_token=" + token
        return {
            method: 'GET',
            url,
        }
    }
    updtaeTag(token, id, name) {
        let url = api.tag.update + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                tag: {
                    id,
                    name
                }
            }
        }
    }
    delTag(token, id) {
        let url = api.tag.delete + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                tag: {
                    id
                }
            }
        }
    }

    fetchTagUsers(token, id, openId) {
        let url = api.tag.fetchUser + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                tagid: id,
                next_openid: openId || ""
            }
        }

    }
    batchTag(token, openidList, id, unTag) {
        let url = (unTag ? api.tag.batchUnTag : api.tag.batchTag) + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                tagid: id,
                openid_list: openidList
            }
        }
    }

    getUserTags(token, openid) {
        let url = api.tag.getUserTags + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                openid
            }
        }
    }

    remarkUser(token, openId, remark) {
        let url = api.user.mark + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                openid: openId,
                remark: remark,
                access_token: token
            }
        }
    }

    fetchUserList(token, openId) {
        let url = api.user.fetch + "access_token=" + token + "&next_openid=" + (openId || '')
        return {
            method: 'GET',
            url,
        }
    }

    getUserInfo(token, openId, lang = 'zh_CN') {
        let url = api.user.info + "access_token=" + token + "&openid=" + (openId || '') + "&lang=" + lang
        return {
            method: 'GET',
            url,
        }
    }

    fetchBatchUsers(token, openIdList) {
        let url = api.user.batch + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                user_list: openIdList
            }
        }
    }

    createQrCode(token, qr) {
        let url = api.qrcodee.create + "access_token=" + token
        const body = qr
        return {
            method: 'POST',
            url,
            body
        }
    }
    showQrCode(ticket) {
        let url = api.qrcodee.show + "ticket=" + encodeURI(ticket)
        return url
    }

    createShortUrl(token, action = "long2short", longurl) {
        let url = api.shortUrl.create + 'access_token=' + token
        const body = {
            action,
            long_url: longurl
        }
        return {
            method: 'POST',
            url,
            body
        }
    }
    semantic(token, semanticData) {
        let url = api.semantic + 'access_token=' + token

        semanticData.appid = this.appID
        return {
            method: 'POST',
            url,
            body: semanticData
        }
    }

    aiTranslate(token, body, lfrom, lto) {
        let url = api.ai.translate + 'access_token=' + token + '&lfrom=' + lfrom + '&lto=' + lto
        return {
            method: 'POST',
            url,
            body
        }
    }
    createMenu(token, menu, rules) {
        let url = api.menu.create + 'access_token=' + token
        if (rules) {
            url = api.menu.custom + 'access_token=' + token
            Object.assign(menu, {
                "matchrule": rules
            })
        }
        return {
            method: 'POST',
            url,
            body: menu
        }
    }
    deleteMenu(token) {
        let url = api.menu.delete + 'access_token=' + token
        return {
            method: 'GET',
            url,
        }
    }
    fetchMenu(token, custom = false) {
        let url = api.menu.fetch + 'access_token=' + token
        if (custom) {
            url = api.menu.fetchCustom + 'access_token=' + token
        }
        return {
            method: 'GET',
            url
        }
    }
    clearRecord(token) {
        let url = api.clean + "access_token=" + token
        return {
            method: 'POST',
            url,
            body: {
                appid: this.appID
            }
        }
    }
}