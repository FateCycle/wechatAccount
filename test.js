// var parseString = require('xml2js').parseString;
// var xml = `<xml>
// <ToUserName name='good'><![CDATA[toUser]]></ToUserName>
// <FromUserName><![CDATA[fromUser]]></FromUserName>
// <CreateTime>1348831860</CreateTime>
// <MsgType><![CDATA[text]]></MsgType>
// <Content><![CDATA[this is a test]]><small>hahahhaha</small></Content>
// <MsgId>
// <Id>this</Id>
// <age>is</age>
// </MsgId>
// </xml>`
// parseString(xml,function (err, result) {
//     if(err) console.log(err)
//     console.log(result)
// });

// function transform(result) {
//     if (typeof result === 'object') {
//         for(let k in result) {
//             let v = result[k]
//             if(!(v instanceof Array) || v.length === 0) {
//                 if(typeof v === 'object') {
//                     result[k] = transform(v)
//                 }
//                 continue
//             }
//             if (v.length === 1) {
//                 let item= v[0]
//                 if(typeof item === 'object')
//                     result[k] = transform(item)
//                 else {
//                     result[k] = item
//                 }
//             }

//         }
//         return result
//     }
// }





// var contentType = require('content-type')
// var express = require('express')
// var getRawBody = require('raw-body')

// var app = express()

// app.use(function (req, res, next) {
//   getRawBody(req, {
//     // length: req.headers['content-length'],
//     limit: '1mb',
//     encoding: 'utf8'
//   }, function (err, string) {
//     if (err) return next(err)
//     req.text = string
//     console.log(req.text)
//     next()
//   })
// })
// app.listen(3000)
// const p =new Promise(resolve=>{
//    let u = 1 
//    setTimeout(()=>{
//       if (u===1) return resolve(4)
//       resolve(5)
//    },3000)
// })

// p.then(data=>console.log(data))


function t() {
   return new Promise(resolve=> {
      setTimeout(()=>{
         resolve(9)
      },3000)
   })
}


let a = [1,2.3]
let x = async (a) => {
   let c = await t()
   a[0] = c
}
let y = async (x) => {
   await x(a)
   console.log(a)
}
y(x)
console.log(a)

