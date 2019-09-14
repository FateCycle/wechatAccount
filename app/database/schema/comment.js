const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const CommentSchema = new mongoose.Schema({
   movie: {
      type: ObjectId,
      ref: 'Movie'
   },
   from: {
      type: ObjectId,
      ref: 'User'
   },
   replies: [{
      from: {
         type: ObjectId,
         ref: 'User'
      },
      to: {
         type: ObjectId,
         ref: 'User'
      },
      content: String
   }],
   content: String,
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

CommentSchema.pre('save', function (next) {
   if (this.isNew) {
      this.meta.createAt = Date.now()
   }
   this.meta.updateAt = Date.now()
   next()
})

module.exports = Comment = mongoose.model('Comment', CommentSchema)