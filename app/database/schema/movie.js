const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const MovieSchema = new mongoose.Schema({
   doubanId: String,
   title: String,
   director: String,
   language: String,
   country: String,
   summary: String,
   poster: String,
   genres: [String],
   year: Number,
   pv: {
      type: Number,
      default: 0
   },
   category: {
      type: ObjectId,
      ref: 'Category'
   },
   meta: {
      createAt: {
         type: String,
         default: Date.now
      },
      updateAt: {
         type: String,
         default: Date.now
      }
   }
})

MovieSchema.pre('save', function (next) {
   if (this.isNew) {
      this.meta.createAt = Date.now()
   }
   this.meta.updateAt = Date.now()
   next()
})

module.exports = Movie = mongoose.model('Movie', MovieSchema)