const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const CategorySchema = new mongoose.Schema({
   name: String,
   movie: [{
      type: ObjectId,
      ref: 'Movie'
   }],
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

CategorySchema.pre('save', function (next) {
   if (this.isNew) {
      this.meta.createAt = Date.now()
   }
   this.meta.updateAt = Date.now()
   next()
})

module.exports = Category = mongoose.model('Category', CategorySchema)