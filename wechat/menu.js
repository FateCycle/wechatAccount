const musicMenu = {
    "button": [{
            "type": "click",
            "name": "今日歌曲",
            "key": "V1001_TODAY_MUSIC"
        },
        {
            "name": "菜单",
            "sub_button": [{
                    "type": "view",
                    "name": "搜索",
                    "url": "http://www.soso.com/"
                },
                {
                    "type": "miniprogram",
                    "name": "wxa",
                    "url": "http://mp.weixin.qq.com",
                    "appid": "wx286b93c14bbf93aa",
                    "pagepath": "pages/lunar/index"
                },
                {
                    "type": "click",
                    "name": "赞一下我们",
                    "key": "V1001_GOOD"
                }
            ]
        }
    ]
}

const customMenu = {
    "button": [{
            "name": 'Scan_Photo',
            "sub_button": [{
                    "name": '系统拍照发图',
                    "type": "pic_sysphoto",
                    "key": "no_1"
                },
                {
                    "name": '拍照或者相册发图',
                    "type": "pic_photo_or_album",
                    "key": "no_2"
                },
                {
                    "name": '微信相册发图',
                    "type": "pic_weixin",
                    "key": "no_3"
                },
                {
                    "name": '扫码推事件',
                    "type": "scancode_push",
                    "key": "no_4"
                },
                {
                    "name": '等待中扫码',
                    "type": "scancode_waitmsg",
                    "key": "no_5"
                }
            ]

        },
        {
            name: '跳转链接',
            type: 'view',
            url: 'https://www.github.com'
        },
        {
            name: '其他',
            sub_button: [{
                    name: '点击',
                    type: 'click',
                    key: 'no_11'
                },
                {
                    name: '地理位置',
                    type: 'location_select',
                    key: 'no_22'

                }
            ]
        }
    ]
}


const specialMenu = {
    button: [{
            name: 'Scan_Photo',
            sub_button: [{
                name: '系统拍照',
                type: 'pic_sysphoto',
                key: 'no_1'
            }, {
                name: '拍照或者发图',
                type: 'pic_photo_or_album',
                key: 'no_2'
            }, {
                name: '微信相册发布',
                type: 'pic_weixin',
                key: 'no_3'
            }, {
                name: '扫码',
                type: 'scancode_push',
                key: 'no_4'
            }, {
                name: '等待中扫码',
                type: 'scancode_waitmsg',
                key: 'no_5'
            }]
        },
        {
            name: '跳新链接',
            type: 'view',
            url: 'https://www.imooc.com'
        },
        {
            name: '其他',
            sub_button: [{
                name: '点击',
                type: 'click',
                key: 'no_11'
            }, {
                name: '地理位置',
                type: 'location_select',
                key: 'no_12'
            }]
        }
    ]
}

const animationMenu = {
    "button": [{
            "type": "click",
            "name": "虚白",
            "key": "V1001_TODAY_MUSIC",
            "sub_button": []
        },
        {
            "type": "click",
            "name": "史塔克",
            "key": "V1001_TODAY_SINGER",
            "sub_button": []
        },
        {
            "name": "乌尔奇奥拉",
            "sub_button": [{
                    "type": "view",
                    "name": "葛力姆乔",
                    "url": "http://www.soso.com/",
                },
                {
                    "type": "view",
                    "name": "诺伊特拉",
                    "url": "http://v.qq.com/",
                }
            ]
        }
    ]
}


const commonMenu = {
    "button": [{
            "name": "排行榜",
            "sub_button": [{
                    "name": "最热门",
                    "type": "click",
                    "key": "movie_hot"
                },
                {
                    "name": "最冷门",
                    "type": "click",
                    "key": "movie_cold"
                },
            ]
        },
        {
            "name": "分类",
            "sub_button": [{
                    "type": "click",
                    "name": "科幻",
                    "key": "movie_science",
                },
                {
                    "type": "click",
                    "name": "动画",
                    "key": "movie_animation",
                }
            ]
        },
        {
            "type": "click",
            "name": "帮助",
            "key": "help",
        }
    ]
}


module.exports = {
    musicMenu,
    customMenu,
    specialMenu,
    animationMenu,
    commonMenu
}