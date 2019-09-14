const mp = require('./index')
const path = require('path')
const config = require("../config/config")
const {
    musicMenu,
    customMenu,
    specialMenu,
    animationMenu,
    commonMenu
} = require('./menu')
const api = require('../app/api/index')

const help = "亲爱的，欢迎关注疾风码豪\n" +
    "回复1-3，测试文字回复\n" +
    "回复4,测试图片回复\n" +
    "回复首页，进入网站首页\n" +
    "回复电影名称，查询电影信息\n" +
    "点击帮助，获取帮助信息\n" +
    "某些功能呢,订阅号没有权限，比如网页授权\n" +
    "回复语音，查询电影信息\n" +
    "也可以点击<a href='" + config.base + "/sdk'>语音查电影</a>,来查询电影信息\n"

exports.replay = async (ctx, next) => {
    const message = ctx.weixing
    let client = mp.getWechat()
    let replayMsg, movies, catData, menu, count
    console.log(message.MsgType)
    switch (message.MsgType) {
        case 'text':
            let content = message.Content
            let data
            replayMsg = `你说的${content}太复杂了，无法解析`
            switch (content) {
                case '0':
                    replayMsg = '火影'
                    break;
                case '1':
                    replayMsg = '海贼'
                    break;
                case '2':
                    replayMsg = '死神'
                    break;
                case '3':
                    replayMsg = '妖尾'
                    break;
                case '4':
                    data = await client.handle('uploadMaterial', 'image', path.resolve(__dirname, '../2.jpg'))
                    replayMsg = {
                        type: 'image',
                        mediaId: data.media_id
                    }
                    break;
                case '5':
                    data = await client.handle('uploadMaterial', 'video', path.resolve(__dirname, '../6.mp4'))
                    replayMsg = {
                        type: 'video',
                        mediaId: data.media_id,
                        description: '很牛逼的视频',
                        title: '这是个视频'
                    }
                    break;
                case '6':
                    //上传永久的视频必须提交description的字段
                    data = await client.handle('uploadMaterial', 'video', path.resolve(__dirname, '../6.mp4'), {
                        description: '{"title": "这个地方很棒", "introduction": "好吃不如饺子"}'
                    })
                    //没有设置会默认调用上面存储到服务器的description的值
                    replayMsg = {
                        type: 'video',
                        //title: '回复的视频标题 2',
                        description: '打个篮球玩玩',
                        mediaId: data.media_id
                    }
                    break;
                case '7':
                    //永久图片
                    data = await client.handle('uploadMaterial', 'image', path.resolve(__dirname, '../2.jpg'), {
                        type: 'image'
                    })
                    replayMsg = {
                        type: 'image',
                        mediaId: data.media_id
                    }
                    break;
                case '8':
                    data = await client.handle('uploadMaterial', 'image', path.resolve(__dirname, '../2.jpg'), {
                        type: 'image'
                    })
                    let data2 = await client.handle('uploadMaterial', 'pics', path.resolve(__dirname, '../2.jpg'), {
                        type: 'image'
                    })
                    let media = {
                        "articles": [{
                                "title": "这是服务器上传的图片",
                                "thumb_media_id": data.media_id,
                                "author": "FateCycle",
                                "digest": "没有摘要",
                                "show_cover_pic": 1,
                                "content": '前往慕课网',
                                "content_source_url": 'http://coding.imooc.com/',
                            },
                            {
                                "title": "这是服务器上传的图片2",
                                "thumb_media_id": data.media_id,
                                "author": "FateCycle",
                                "digest": "没有摘要",
                                "show_cover_pic": 1,
                                "content": '前往github',
                                "content_source_url": 'http://github.com/',
                            }
                        ]
                    }
                    let uploadData = await client.handle('uploadMaterial', 'news', media, true)
                    //thumb_media_id为必须选项
                    let newMedia = {
                        "media_id": uploadData.media_id,
                        "index": 0,
                        "articles": {
                            "title": "神奇的图文",
                            "thumb_media_id": data.media_id,
                            "author": "Truth1984",
                            "digest": "你很强",
                            "show_cover_pic": 1,
                            "content": '前往公众平台',
                            "content_source_url": 'https://mp.weixin.qq.com/'
                        }
                    }
                    let mediaData = await client.handle('editMaterial', uploadData.media_id, newMedia)
                    let newsData = await client.handle('fetchMaterial', uploadData.media_id, 'news', true)
                    let items = newsData.news_item
                    let news = []
                    items.forEach(item => {
                        news.push({
                            title: item.title,
                            description: item.digest,
                            picUrl: item.thumb_media_id,
                            url: item.url
                        })
                    })
                    replayMsg = news
                    //let delData =await client.handle('deleteMaterial',uploadData.media_id)
                    break;
                case '9':
                    count = client.handle('countMaterial')
                    let res = await Promise.all([
                        client.handle('batchMaterial', {
                            "type": 'image',
                            "offset": 0,
                            "count": 10
                        }),
                        client.handle('batchMaterial', {
                            "type": 'video',
                            "offset": 0,
                            "count": 10
                        }),
                        client.handle('batchMaterial', {
                            "type": 'voice',
                            "offset": 0,
                            "count": 10
                        }),
                        client.handle('batchMaterial', {
                            "type": 'news',
                            "offset": 0,
                            "count": 10
                        }),
                    ])
                    replayMsg = `
                    image: ${res[0].total_count}
                    video: ${res[1].total_count}
                    voice: ${res[2].total_count}
                    news: ${res[3].total_count}
                    `
                    break;
                case '10':
                    //tag不能重名不然无效
                    // let newTag = await client.handle("createTag", 'leha')
                    // console.log(newTag)
                    // let delTag = await client.handle("delTag", 100)
                    // console.log(delTag)
                    // let updateTag = await client.handle("updtaeTag", 101 , 'mooc')
                    // console.log(updateTag)
                    // let userList = await client.handle("fetchTagUsers",101)
                    // console.log(userList)
                    // let tagDatas = await client.handle("fetchTag")
                    // console.log(tagDatas)
                    let UserTags = await client.handle('getUserTags', message.FromUserName)
                    // let batchTags = await client.handle('batchTag',[message.FromUserName],101,false)
                    // console.log(batchTags)
                    replayMsg = UserTags.tagid_list.length
                    break;
                case '11':
                    let userList = await client.handle('fetchUserList')
                    console.log(userList)
                    replayMsg = userList.total + '个关注者'
                    break;
                case '12':
                    data = await client.handle('remarkUser', message.FromUserName, "FateCycle")
                    console.log(data)
                    replayMsg = '改名成功'
                    break;
                case '13':
                    data = await client.handle('getUserInfo', message.FromUserName, "zh_CN")
                    replayMsg = JSON.stringify(data)
                    break;
                case '14':
                    let UserListInfo = await client.handle('fetchBatchUsers', [{
                        "openid": message.FromUserName,
                        "lang": "zh_CN"
                    }, ])
                    console.log(UserListInfo)
                    replayMsg = JSON.stringify(UserListInfo)
                    break;
                case '15':
                    let tempQrData = {
                        expire_seconds: 604800,
                        action_name: 'QR_SCENE',
                        action_info: {
                            scene: {
                                scene_id: 123
                            }
                        }
                    }
                    let tempTicketData = await client.handle("createQrCode", tempQrData)
                    let tempQrCode = await client.showQrCode(tempTicketData.ticket)
                    replayMsg = tempQrCode
                    break;
                case '16':
                    let longUrl = 'https://blog.csdn.net/XXJ19950917/article/details/78310346'
                    shortUrl = await client.handle('createShortUrl', 'long2short', longUrl)
                    replayMsg = shortUrl.short_url
                    break;
                case '17':
                    let semanticData = {
                        "query": "查一下明天从北京到上海的南航机票",
                        "city": "北京",
                        "category": "flight,hotel",
                        "uid": message.ToUserName
                    }
                    let semanticObj = await client.handle('semantic', semanticData)
                    console.log(semanticObj)
                    replayMsg = JSON.stringify(semanticObj)
                    break;
                case '18':
                    let translateMsg = '你去过美国么'
                    let aiTranslateObj = await client.handle('aiTranslate', translateMsg, 'zh_CN', 'en_US')
                    replayMsg = aiTranslateObj.from_content + aiTranslateObj.to_content
                    break;
                case '19':
                    //先删除再添加
                    let delData = await client.handle('deleteMenu')
                    console.log(delData)
                    menu = musicMenu
                    data = await client.handle('createMenu', menu)
                    console.log(data)
                    replayMsg = '默认菜单创建成功'
                    break;
                case '20':
                    //先删除再添加
                    let delData2 = await client.handle('deleteMenu')
                    console.log(delData2)
                    menu = customMenu
                    data = await client.handle('createMenu', menu)
                    replayMsg = '自定义菜单创建成功'
                    console.log(data)
                    break;
                case '21':
                    //第一个个性化菜单
                    //menu = specialMenu
                    //第二个个性化菜单
                    menu = animationMenu
                    //匹配规则，用户微信使用的语言是英文
                    rules = {
                        "language": "en"
                    }
                    data = await client.handle('createMenu', menu, rules)
                    console.log(data)
                    menuInfo = await client.handle('fetchMenu')
                    replayMsg = JSON.stringify(menuInfo)
                    break;
                case '22':
                    data = await client.handle('clearRecord')
                    replayMsg = JSON.stringify(data)
                    break;
                case '更新菜单':
                    try {
                        await client.handle('deleteMenu')
                        console.log(commonMenu)
                        data = await client.handle('createMenu', commonMenu)
                        console.log(data)
                    } catch (e) {
                        console.log(e)
                    }
                    replayMsg = '更新菜单成功，请在5分钟或取消关注再重新关注可以看到新菜单'
                    break;
                case '首页':
                    replayMsg = [{
                        title: '观影阁',
                        description: '总有一款属于你的电影',
                        picUrl: path.resolve(__dirname, '../2.jpg'),
                        url: config.base
                    }]
                    break;
                case 'nit':
                    countUserData = await api.wechat.saveMPUser(message, 'nit')
                    const user = countUserData.user
                    count = countUserData.count
                    let nickname = user.nickname || ''
                    if (user.gender === '1') {
                        nickname = `小鲜肉 - ${nickname}`
                    } else {
                        nickname = `小姐姐 - ${nickname}`
                    }

                    let guess = '我猜不出你在哪里'

                    if (user.province || user.city) {
                        guess = `我猜你来自${user.province || '未知'}省，${user.city || '未知'}市`
                    }
                    replayMsg = `哦呦喂,你是来自宁波理工的${nickname},` +
                        `你现在正和${count}个同样来自宁波理工的小伙伴一起观影` +
                        `${guess},哈哈我是不是很聪明呢,关注我实电影资讯一手掌握`
                    break;
                default:
                    replayMsg = []
                    replayMsg = await api.movie.findMovieByAllMethod(replayMsg, content)
                    console.log(replayMsg)
                    break;
            }
            break;
        case 'event':
            let event = message.Event
            console.log(event)
            switch (event) {
                case 'CLICK':
                    console.log(message.EventKey)
                    //replayMsg = '你点击了菜单的' + message.EventKey
                    switch (message.EventKey) {
                        case 'help':
                            replayMsg = help
                            break
                        case 'movie_hot':
                            movies = await api.movie.findHotMovie(-1, 4)
                            console.log(movies)
                            replayMsg = []
                            movies.forEach(movie => {
                                replayMsg.push({
                                    'title': movie.title,
                                    'description': movie.summary,
                                    'picUrl': movie.poster.indexOf('http') > -1 ? movie.poster : config.base + '/upload/' + movie.poster,
                                    'url': config.base + '/movie/' + movie._id
                                })
                            })
                            break;
                        case 'movie_cold':
                            movies = await api.movie.findHotMovie(1, 4)
                            replayMsg = []
                            movies.forEach(movie => {
                                replayMsg.push({
                                    'title': movie.title,
                                    'description': movie.summary,
                                    'picUrl': movie.poster.indexOf('http') > -1 ? movie.poster : config.base + '/upload/' + movie.poster,
                                    'url': config.base + '/movie/' + movie._id
                                })
                            })
                            break;
                        case 'movie_science':
                            catData = await api.category.findMovieByCate('科幻')
                            console.log(catData)
                            movies = catData.movie
                            replayMsg = []
                            movies.forEach(movie => {
                                replayMsg.push({
                                    'title': movie.title,
                                    'description': movie.summary,
                                    'picUrl': movie.poster.indexOf('http') > -1 ? movie.poster : config.base + '/upload/' + movie.poster,
                                    'url': config.base + '/movie/' + movie._id
                                })
                            })
                            break;
                        case 'movie_animation':
                            catData = await api.category.findMovieByCate('动画')
                            movies = catData.movie
                            replayMsg = []
                            movies.forEach(movie => {
                                replayMsg.push({
                                    'title': movie.title,
                                    'description': movie.summary,
                                    'picUrl': movie.poster.indexOf('http') > -1 ? movie.poster : config.base + '/upload/' + movie.poster,
                                    'url': config.base + '/movie/' + movie._id
                                })
                            })
                            break;
                    }
                    break;
                case 'VIEW':
                    replayMsg = '你点击了菜单链接' + message.EventKey + ' ' + message.MenuID || ''
                    break;
                case 'scancode_push':
                    replayMsg = '你扫码了' + message.ScanCodeInfo + ' ' + message.ScanResult
                    break;
                case 'scancode_waitmsg':
                    replayMsg = '扫码弹框了' + message.ScanCodeInfo + ' ' + message.ScanResult
                    break;
                case 'pic_sysphoto':
                    replayMsg = '系统拍照发图' + message.SendPicsInfo.Count + ' ' + JSON.stringify(message.SendPicsInfo.PicList)
                    break;
                case 'pic_photo_or_album':
                    replayMsg = '拍照或者相册发图' + message.SendPicsInfo.Count + ' ' + JSON.stringify(message.SendPicsInfo.PicList)
                    break;
                case 'pic_weixin':
                    replayMsg = '微信相册发图' + message.SendPicsInfo.Count + ' ' + JSON.stringify(message.SendPicsInfo.PicList)
                    break;
                case 'location_select':
                    replayMsg = '地理位置' + JSON.stringify(message.SendLocationInfo)
                    break;
                case 'subscribe':
                    //如果是扫码赶住会有ticket和EventKey参数
                    replayMsg = '欢迎订阅' + '扫码参数' + (message.EventKey ? message.EventKey + '_' + message.ticket : '')
                    break;
                case 'SCAN':
                    replayMsg = '欢迎订阅' + '扫码参数' + (message.EventKey ? message.EventKey + '_' + message.ticket : '')
                case 'unsubscribe':
                    replayMsg = '狠心退订'
                    break;
                case 'LOCATION':
                    replayMsg = `地理位置:经度${message.Latitude}纬度${message.Longitude}精度${message.Precision}`
                    break;
            }
            break;
        case 'voice':
            replayMsg = []
            let voiceText = message.Recognition
            voiceText = voiceText.substr(0, voiceText.length - 1)
            replayMsg = await api.movie.findMovieByAllMethod(replayMsg, voiceText)
            break;
    }
    console.log(replayMsg)
    ctx.body = replayMsg
    await next()
}