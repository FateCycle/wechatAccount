const Category = require('../database/schema/category')
const Movie = require('../database/schema/movie')
const api = require('../api')
exports.show = async (ctx, next) => {
   const _id = ctx.params._id;
   let category = {}
   if (_id) {
      category = await api.category.findCategoryById(_id)
   }
   await ctx.render('pages/category_admin.pug', {
      title: '后台分类录入页面',
      category
   })
}


exports.new = async (ctx, next) => {
   const {
      name,
      _id
   } = ctx.request.body.category
   let category
   ///说明是更新进来的
   if (_id) {
      category = await api.category.findCategoryById(_id)
   }
   //category有值表示是修改按钮进来的，没有表示是直接进行标签的新增
   if (category) {
      category.name = name
   } else {
      category = new Category({
         name: name
      })
   }
   await category.save()
   ctx.redirect('/admin/category/list')
}

exports.list = async (ctx, next) => {
   const categoryList = api.category.findCategoryList()
   await ctx.render('pages/category_list.pug', {
      title: '分类列表页面',
      categoryList
   })
}

exports.del = async (ctx, next) => {
   const id = ctx.query.id
   await Movie.deleteMany({
      category: id
   })
   try {
      await Category.deleteOne({
         _id: id
      })
      ctx.body = {
         success: true
      }
   } catch (e) {
      console.log(e)
      ctx.body = {
         success: false
      }
   }
}