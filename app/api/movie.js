const Categroy = require('../database/schema/category')
const Movie = require('../database/schema/movie')
const categoryAPI = require('./category')
const config = require('../../config/config')
exports.searchByCategory = async (cateId) => {
   const data = await Categroy.find({
      _id: cateId
   }).populate({
      path: 'movie',
      select: '_id title poster'
   })
   return data
}


exports.searchByKeyword = async (q) => {
   const data = await Movie.find({
      title: new RegExp(q, 'i')
   })
   return data
}


exports.findMovieById = async (id) => {
   const data = await Movie.findOne({
      _id: id
   })
   return data
}

exports.findMoviesAndCategory = async (fields) => {
   const data = await Movie.find({}).populate('category', fields)
   return data
}

exports.findHotMovie = async (hot, count) => {
   const data = await Movie.find({}).sort({
      'pv': hot
   }).limit(count)
   return data
}


// exports.searchByDouban = async(content) => {

// }


exports.findMovieByAllMethod = async (replayMsg = [], content) => {
   let movies = await this.searchByKeyword(content)
   if (!movies || movies.length === 0) {
      let category = await categoryAPI.findMovieByCate(content)
      if (category) {
         movies = category.movie
      }
   }

   // if (!movie || movies.length === 0) {
   //    movies = await api.movie.searchByDouban(content)
   // }

   if (movies && movies.length) {
      movies = movies.slice(0, 4)

      movies.forEach(movie => {
         replayMsg.push({
            'title': movie.title,
            'description': movie.summary,
            'picUrl': movie.poster.indexOf('http') > -1 ? movie.poster : config.base + '/upload/' + movie.poster,
            'url': config.base + '/movie/' + movie._id
         })
      })
   } else {
      replayMsg = '没有查询到与' + content + '相关的电影，要不要换一个电影名字试试看'
   }

   return replayMsg

}