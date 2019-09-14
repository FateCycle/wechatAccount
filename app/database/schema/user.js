const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10
const LOCK_TIME = 2*60*60
const MAX_LOGIN_ATTEMPTS = 5
const UserSchema = new Schema({
   role: {
      type: String,
      default: 'user'
   },
   openid: [String],
   unionid: String,
   from: String,
   nickname: String,
   address: String,
   province: String,
   country: String,
   city: String,
   gender: String,
   email:  String,
   password: String,
   loginAttempts: {
      type: Number,
      require: true,
      default: 0
   },
   lockUntil: Number,
   meta: {
      createAt: {
         type: Date,
         default: Date.now
      },
      updateAt: {
         type: Date,
         default: Date.now
      }
   }

})

UserSchema.virtual('islocked').get(function(){
   if (this.lockUntil && this.lockUntil > Date.now()) {
      return true
   }
   return false
})

UserSchema.pre('save', function(next) {
   if (this.isNew) {
      this.meta.createAt = Date.now()
   }
   this.meta.updateAt = Date.now()
   next()
})

UserSchema.pre('save', function(next) {
   //暂时保存this，因为毁掉函数里面的This就不是指向document了
   let user = this
   if(!this.isModified('password'))  return next()
   //SALT_WORK_FACTOR用来生成一个salt使用salt进行加密
   bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
      if(err) return next(err)
      user.password = hash
      next()
   });
})

UserSchema.methods = {
   comparePassword: function (_password,password) {
      return new Promise((resolve,reject) => {
         bcrypt.compare(_password,password,function(err,isMatch){
            if (err) reject(err)
            else resolve(isMatch)
         })
      })
   },
   
   //将失败次数加1，所以默认条件是可以登录
   incLoginAttempt: function () {
      return new Promise((resolve,reject) => {
         //解锁充值状态
         if (this.lockUntil && this.lockUtil < Date.now()) {
            this.update({$set: {"loginAttempts": 1}, $unset: {"lockUtil":1}},(err) => {
               if(err) reject(err)
               resolve(true)
            })
         } else {
            //两种情况
            //lockUtil为null  代表出在锁定和未锁定中间，次数+1即可
            //this.lockUntil && this.lockUtil >= Date.now() 锁定状态 可以简写成islocked
            if (islocked) resolve()
            if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
               this.update({lockUntil: Date.now + LOCK_TIME})  
            }
            this.update({$inc:{loginAttempts: 1}},(err) => {
               if (err) reject(err)
               resolve(true)
            })
         }
          
      })

   }   
}

module.exports = mongoose.model('User',UserSchema)