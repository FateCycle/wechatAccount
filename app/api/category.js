const Category = require('../database/schema/category')

exports.findCategoryById = async (id) => {
   let data = await Category.findOne({
      _id: id
   })
   return data
}

exports.findCategoryList = async () => {
   let data = await Category.find({})
   return data
}

exports.findMovieByCate = async (name) => {
   const data = await Category.findOne({
      name: name
   }).populate({
      path: 'movie',
      select: '_id title summary poster'
   })
   return data
}