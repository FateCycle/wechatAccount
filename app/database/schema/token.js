const mongoose = require('mongoose')

let Schema = mongoose.Schema
let TokenSchema = new Schema({
    name: String,
    token: String,
    expires_in: Number,
    meta: {
        createTime: {
            type: Date,
            default: Date.now
        },
        updateTime: {
            type: Date,
            default: Date.now
        }
    }
})


TokenSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createTime = this.meta.updateTime = Date.now
    } else {
        this.meta.updateTime = Date.now
    }
    next()
})


TokenSchema.statics = {
    async getAccessToken() {
        data = await this.findOne({
            name: 'access_token'
        })
        if (data && data.token) {
            data.access_token = data.token
        }
        return data
    },
    async setAccessToken(data) {
        let token = await this.findOne({
            name: 'access_token'
        })
        if (token) {
            token.token = data.access_token
            token.expires_in = data.expires_in
        } else {
            //调用的时候后面的Token早就声明过了，先初始化出Token，之后才会调用异步函数
            token = new Token({
                name: 'access_token',
                token: data.access_token,
                expires_in: data.expires_in
            })
        }
        let res = await token.save()
        return res
    }
}
module.exports = Token = mongoose.model("Token", TokenSchema)