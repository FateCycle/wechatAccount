const {
   readFile,
   writeFile
} = require('fs')
const {
   resolve
} = require('path')
const Movie = require('../database/schema/movie')
const Category = require('../database/schema/category')
const Comment = require('../database/schema/comment')
const _ = require('lodash')
const util = require('util')
const readFileAsync = util.promisify(readFile)
const writeFileAsync = util.promisify(writeFile)
const api = require('../api')


exports.detail = async (ctx, next) => {
   const id = ctx.params.id
   await Movie.update({
      _id: id
   }, {
      $inc: {
         "pv": 1
      }
   })
   const movie = await api.movie.findMovieById(id)
   const comments = await Comment.find({
         movie: id
      })
      .populate('from', 'nickname')
      .populate('replies.from replies.to', 'nickname')
   await ctx.render('pages/detail.pug', {
      title: '电影详情页',
      movie,
      comments
   })
}


exports.savePoster = async (ctx, next) => {
   const posterData = ctx.request.files.file
   const filePath = posterData.path
   const fileName = posterData.name
   if (fileName) {
      const data = await readFileAsync(filePath)
      const timestamp = Date.now()
      //[0]是Image,[1才是类型]
      const type = posterData.type.split('/')[1]
      //时间戳.类型给图片命名
      const poster = timestamp + '.' + type
      const newPath = resolve(__dirname, '../../', 'public/upload/', poster)
      await writeFileAsync(newPath, data)
      ctx.poster = poster
   }

   await next()
}

exports.show = async (ctx, next) => {
   const _id = ctx.params.id
   let movie = {}
   if (_id) {
      movie = await api.movie.findMovieById(_id)
   }
   let categoryList = await api.category.findCategoryList()
   await ctx.render('pages/movie_admin.pug', {
      title: '电影录入页面',
      movie,
      categoryList
   })

}

exports.new = async (ctx, next) => {
   let movieData = ctx.request.body
   const categoryId = movieData.categoryId
   const categoryName = movieData.categoryName
   let category
   let movie
   //更新操作
   if (movieData._id) {
      movie = await api.movie.findMovieById(movieData._id)
   }

   //是否选中id或者新增name
   if (categoryId) {
      category = await api.category.findCategoryById(categoryId)
   } else if (categoryName) {
      category = new Category({
         name: categoryName
      })
      await category.save()
   }
   //更新操作和新增操作
   if (movie) {
      movie = _.extend(movie, movieData)
      movie.category = category._id
   } else {
      delete movieData._id
      movieData.category = category._id
      movie = new Movie(movieData)
   }
   if (ctx.poster) {
      movie.poster = ctx.poster
   }
   category = await api.category.findCategoryById(category._id)
   if (category) {
      category.movie = category.movie || []
      category.movie.push(movie._id)
      await category.save()
   }
   await movie.save()
   ctx.redirect('/admin/movie/list')
}

exports.list = async (ctx, next) => {
   const movieList = await api.movie.findMoviesAndCategory('name')
   await ctx.render('pages/movie_list.pug', {
      title: '分类列表页面',
      movieList
   })
}


exports.del = async (ctx, next) => {
   const id = ctx.query.id
   let cate = await Category.findOne({
      movie: {
         $in: [id]
      }
   })
   if (cate && cate.movie.length) {
      let index = cate.movie.indexOf(id)
      cate.movie.splice(index, 1)
      await cate.save()
   }
   try {
      await Movie.deleteOne({
         _id: id
      })
      ctx.body = {
         success: true
      }
   } catch (e) {
      ctx.body = {
         success: false
      }
   }
}

exports.search = async (ctx, next) => {
   let {
      cat,
      p,
      q
   } = ctx.request.query
   let page = parseInt(p) || 0
   let count = 2
   let index = count * page
   //cat有值是分页，没值是查询
   //返回de query表示是根据搜索框查找还是分类连接查找，为后面分页提供url参数
   if (cat) {
      let categoryList = await api.movie.searchByCategory(cat)
      let category = categoryList[0]
      let movies = category.movie
      let results = movies.slice(index, index + count)
      await ctx.render('pages/results', {
         title: '分页搜索结果页面',
         keyword: category.name,
         currentPage: page + 1,
         query: 'cat=' + cat,
         totalPage: Math.ceil(movies.length / count),
         movies: results
      })
   } else {
      let movies = await api.movie.searchByKeyword(q)
      let reuslts = movies.slice(index, index + count)
      await ctx.render('pages/results', {
         title: '关键词搜索页面',
         keyword: q,
         currentPage: page + 1,
         query: 'q=' + q,
         totalPage: Math.ceil(movies.length / count),
         movies: reuslts
      })
   }
}