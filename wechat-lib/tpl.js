const ejs = require('ejs')

var tpl = `
<xml>
  <ToUserName><![CDATA[<%= ToUserName %>]]></ToUserName>
  <FromUserName><![CDATA[<%= FromUserName %>]]></FromUserName>
  <CreateTime><%= CreateTime %></CreateTime>
  <MsgType><![CDATA[<%= MsgType %>]]></MsgType>
  <% if (MsgType === 'text') { %>
    <Content><![CDATA[<%= Content %>]]></Content>
  <% } else if (MsgType === 'image'){ %>
    <Image>
        <MediaId><![CDATA[<%= Content.mediaId %>]]></MediaId>
    </Image>
  <% } else if (MsgType === 'voice') { %>
    <Voice>
        <MediaId><![CDATA[<%= Content.mediaId %>]]></MediaId>
    </Voice>
  <% } else if (MsgType === 'video') { %>
    <Video>
        <MediaId><![CDATA[<%= Content.mediaId %>]]></MediaId>
        <Title><![CDATA[<%= Content.title %>]]></Title>
        <Description><![CDATA[<%= Content.description %>]]></Description>
    </Video>
  <% } else if (MsgType === 'music') { %>
    <Music>
        <Title><![CDATA[<%= Content.title %>]]></Title>
        <Description><![CDATA[<%= Content.description %>]]></Description>
        <MusicUrl><![CDATA[<%= Content.musicUrl %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%= Content.hqMusicUrl %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%= Content.thumbMediaId %>]]></ThumbMediaId>
    </Music>
  <% } else { %>
    <ArticleCount><%= Content.length %></ArticleCount>
    <Articles>
        <% Content.forEach(function(item){ %>
            <item>
                <Title><![CDATA[<%= item.title%>]]></Title>
                <Description><![CDATA[<%= item.description%>]]></Description>
                <PicUrl><![CDATA[<%= item.picUrl%>]]></PicUrl>
                <Url><![CDATA[<%= item.url%>]]></Url>
            </item>
        <% }); %>
    </Articles>
  <% } %>
</xml>
`
module.exports = ejs.compile(tpl)