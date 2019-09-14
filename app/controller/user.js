const User = require('../database/schema/user')
exports.showSignin = async (ctx, next) => {
   await ctx.render('pages/signin.pug', {
      title: '登录页面'
   })
}

exports.showSignup = async (ctx, next) => {
   await ctx.render('pages/signup.pug', {
      title: '注册页面'
   })
}

exports.signin = async (ctx, next) => {
   let {
      email,
      password
   } = ctx.request.body.user
   let user = await User.findOne({
      email
   })
   if (!user) return ctx.redirect('/user/signup')
   const isMatch = await user.comparePassword(password, user.password)
   //数据库查出来的user来作为session
   if (isMatch) {
      ctx.redirect('/')
      ctx.session.user = {
         _id: user._id,
         role: user.role,
         nickname: user.nickname
      }
   } else {
      ctx.redirect('/user/signin')
   }

}

exports.signup = async (ctx, next) => {
   let {
      email,
      password,
      nickname
   } = ctx.request.body.user
   let user = await User.findOne({
      email
   })
   if (user) return ctx.redirect('/user/signin')
   user = new User({
      email,
      password,
      nickname
   })
   ctx.session.user = {
      _id: user._id,
      role: user.role,
      nickname: user.nickname
   }
   console.log(ctx.session.user)
   let data = await user.save()
   ctx.redirect('/')
}

exports.logout = async (ctx, next) => {
   ctx.session.user = {}
   ctx.redirect('/')
}

exports.list = async (ctx, next) => {
   let userList = await User.find({})
   console.log(userList)
   await ctx.render('pages/userlist.pug', {
      title: '用户列表页面',
      userList
   })
}


exports.signinRequired = async (ctx, next) => {
   const user = ctx.session.user
   if (!user || !user._id) {
      return ctx.redirect('/user/signin')
   }
   await next()
}

exports.adminRequired = async (ctx, next) => {
   const user = ctx.session.user
   if (user.role !== 'admin') {
      return ctx.redirect('/user/signin')
   }
   await next()
}