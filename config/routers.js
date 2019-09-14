const WeChat = require('../app/controller/wechat')
const User = require('../app/controller/user')
const Category = require('../app/controller/category')
const Index = require('../app/controller/index')
const Comment = require('../app/controller/comment')
const Movie = require('../app/controller/movie')
const koaBody = require('koa-body')


module.exports = (router) => {
    router.get('/', Index.homePage)

    router.get('/wx-sdk', WeChat.sdk)
    router.get('/wx-oauth', WeChat.oauth)
    router.get('/getUserInfo', WeChat.userInfo)

    router.get('/results',Movie.search)
    router.post('/comment',Comment.save)

    router.post('/wechat/signature',WeChat.getSDKSignature)

    router.get('/wx-hear', WeChat.hear)
    router.post('/wx-hear', WeChat.hear)

    router.get('/user/signin', User.showSignin)
    router.get('/user/signup', User.showSignup)
    router.post('/user/signin', User.signin)
    router.post('/user/signup', User.signup)
    router.get('/logout', User.logout)

    router.get('/admin/category', User.signinRequired, User.adminRequired, Category.show)
    router.post('/admin/category', User.signinRequired, User.adminRequired, Category.new)
    router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
    router.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.show)
    router.delete('/admin/category',User.signinRequired,User.adminRequired,Category.del)

    router.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.show)
    router.post('/admin/movie', User.signinRequired, User.adminRequired,koaBody({multipart:true}),Movie.savePoster, Movie.new)
    router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.show)
    router.delete('/admin/movie', User.signinRequired, User.adminRequired, Movie.del)
    router.get('/movie/:id',Movie.detail)
}