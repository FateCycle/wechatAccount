const {
   getWechat
} = require('../../wechat/index')
const {
   sign
} = require('../../wechat-lib/util')
const {
   getOAuth
} = require('../../wechat/index')
const User = require('../database/schema/user')
exports.signature = async (url) => {
   let client = getWechat()
   const tokenData = await client.fetchAccessToken()
   const token = tokenData.access_token
   const ticketData = await client.fetchTicket(token)
   const ticket = ticketData.ticket
   let params = sign(ticket, url)
   params.appId = client.appID
   return params
}

exports.getAuthorizeURL = (scope, target, state) => {
   let oauth = getOAuth()
   let url = oauth.getAuthorizeURL(scope, target, state)
   return url
}

exports.getUserInfoByCode = async (code) => {
   let oauth = getOAuth()
   let tokenData = await oauth.fetchAccessToken(code)
   let UserData = await oauth.fetchUserInfo(tokenData.access_token, tokenData.openid)
   return UserData
}

exports.saveWechatUser = async (userData) => {
   let query = {
      id: userData.openid
   }
   if (userData.unionid) {
      query = {
         id: userData.unionid
      }
   }
   let user = await User.findOne(query)
   if (!user) {
      user = new User({
         openid: userData.openid,
         unionid: userData.unionid,
         nickname: userData.nickname,
         email: userData.email + '@wx.com',
         province: userData.province,
         country: userData.country,
         city: userData.city,
         gender: userData.gender || userData.sex
      })
      await user.save()
   }


   return user
}


exports.saveMPUser = async (message, from = '') => {
   let sceneId = message.EventKey
   let openid = message.FromUserName
   let count = 0
   if (sceneId && sceneId.indexOf('qrscene_') > -1) {
      sceneId = sceneId.replace('qrscenc_', '')
   }

   let user = await User.findOne({
      openid
   })

   if (sceneId === 'nit') {
      from = 'nit'
   }

   let client = getWechat()
   let userInfo = await client.handle('getUserInfo', openid)
   console.log(userInfo)
   let tagid
   // 数据库没有用户就使用获取的微信用户信息新增一个用户
   if (!user) {
      user = new User({
         from: 'nit',
         openid: userInfo.openid,
         unionid: userInfo.unionid,
         nickname: userInfo.nickname,
         email: userInfo.email + '@wx.com',
         province: userInfo.province,
         country: userInfo.country,
         city: userInfo.city,
         gender: userInfo.gender || userData.sex
      })
      user = await user.save()
   }

   // 给用户打上标签，没有的话就新创建标签
   if (from === 'nit') {
      count = await User.count({
         from
      })
      try {
         let tagData = await client.handle('fetchTag')
         tageData = tagData || {}
         let tags = tageData.tags || []
         tags = tags.filter(tag => {
            return tag.name === from
         })

         if (tags && tags.length) {
            tagid = tags[0].id
            count = tags[0].count
         } else {
            res = await client.handle('createTag', 'nit')
            tagid = res.tag.id
         }

         if (tagid) {
            await client.handle('batchTag', [openid], tagid)
         }
      } catch (err) {
         console.log(err)
      }
   }
   return {
      user,
      count
   }
}