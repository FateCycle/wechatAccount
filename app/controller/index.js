const category = require('../database/schema/category')


exports.homePage = async (ctx, next) => {
   const categoryList = await category.find({
      $where: function () {
         return this.movie && this.movie.length > 0
      }
   }).populate({
      path: 'movie',
      select: '_id title poster',
      options: {
         limit: 10
      }
   })
   console.log(categoryList)
   await ctx.render('pages/index.pug', {
      title: '首页',
      categoryList
   })
}