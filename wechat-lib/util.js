const xml2js = require('xml2js');
const template = require('./tpl')
const sha1 = require('sha1')
exports.parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    })
}

exports.formatXML = function formatXML(result) {
    if (typeof result === 'object') {
        for (let k in result) {
            let v = result[k]
            if (!(v instanceof Array) || v.length === 0) {
                if (typeof v === 'object') {
                    result[k] = formatXML(v)
                }
                continue
            }
            if (v.length === 1) {
                let item = v[0]
                if (typeof item === 'object')
                    result[k] = formatXML(item)
                else {
                    result[k] = item
                }
            }

        }
        return result
    }
}


exports.tpl = (content, msg) => {
    let type = 'text'
    if (Array.isArray(content)) {
        type = 'news'
    }
    if (content && content.type) {
        type = content.type
    }
    const info = {
        ToUserName: msg.FromUserName,
        FromUserName: msg.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: type,
        Content: content
    }

    return template(info)
}

const createNonceStr = () => {
    return Math.random().toString(36).substr(2, 16)
}

const createTimeStamp = () => {
    return parseInt(new Date().getTime() / 1000, 10) + ''
}

const signIt = (paramObject) => {
    let keys = Object.keys(paramObject)
    let newArgs = {}
    let str = ''
    keys = keys.sort()
    keys.forEach(elem => {
        newArgs[elem.toLowerCase()] = paramObject[elem]
    })
    for (let key in newArgs) {
        str += '&' + key + '=' + newArgs[key]
    }
    return str.substr(1)
}

const shaIt = (noncestr, timestamp, ticket, url) => {
    const ret = {
        noncestr: noncestr,
        jsapi_ticket: ticket,
        timestamp: timestamp,
        url: url
    }
    const str = signIt(ret)
    const sha = sha1(str)
    return sha
}


exports.sign = (ticket, url) => {
    const noncestr = createNonceStr()
    const timestamp = createTimeStamp()
    const signature = shaIt(noncestr, timestamp, ticket, url)
    return {
        noncestr,
        timestamp,
        signature
    }
}