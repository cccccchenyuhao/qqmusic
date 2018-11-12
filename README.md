# QQ音乐项目

[预览链接](https://chenyuhao.top/qqmusic/) 建议使用手机浏览器打开，pc端F12使用移动设备调试模式。

## 数据接口
[https://github.com/cccccchenyuhao/qqmusic-api](https://github.com/cccccchenyuhao/qqmusic-api)

使用express搭建nodejs服务器伪造请求，部署在[https://app-qqmusicapi.wedeploy.io/](https://app-qqmusicapi.wedeploy.io/)

跨域使用`cors`

转发请求使用`request-promise`

`/` 获取首页数据 无参数

`/rank` 获取排行榜数据 无参数

`/search`获取搜索结果  w:关键词&p:页码&n:每页项数
`/lyric`获取歌词，返回数据为jsonp格式，用正则表达式处理返回字符串数据(歌词是经过转义的，页面接受到数据需要反转义处理)  参数 id: 歌词id


example：

```javascript
app.get('/', (req, res) => {
    const url = `https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=${+new Date()}`
    var options = {
        uri: url,
        headers: {
            'authority': 'c.y.qq.com',
            'referer': 'https://m.y.qq.com/',
            'authority': 'c.y.qq.com',
            'accept': 'application/json',
            'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Mobile Safari/537.36'
        },
        json: true // Automatically parses the JSON string in the response
    }
    request(options)
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            console.log(err.message)
            // API call failed...
        })
})
```



## 静态页面

项目为单页应用，css使用scss编写，并用node-sass编译

布局主要使用浮动、定位实现。响应式的部分用百分比和vh单位，细节用px单位微调。在大部分设备上都可以正常显示。

css3部分
懒加载滚动条旋转
```
      @keyframes animal {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(-360deg);
        }
      }
      i {
        display: inline-block;
        animation: animal 1s infinite linear;
        transform-origin: center center;
      }
```

歌词滚动及遮罩
```
//滚动
      transition: -webkit-transform 0.3s ease-out 0s;
      transform-origin: 0px 0px 0px;
      transform: translate3d(0px, 0px, 0px);

//遮罩
    -webkit-mask: -webkit-linear-gradient(
      top,
      rgba(0, 0, 0, 0),
      #fff 25%,
      #fff 75%,
      rgba(0, 0, 0, 0)
    );

```

## 功能分析
[TAB组件](https://github.com/cccccchenyuhao/qqmusic/blob/master/scripts/tab.js):单页应用，3个选项卡。点击tab展示对应内容(原生js)

[无限轮播组件](https://github.com/cccccchenyuhao/qqmusic/blob/master/scripts/carousel.js): 图片横向排放绝对定位，第一张前面`prepend()`最后一张图片拷贝，最后一张图片`append()`第一张图片拷贝。播放到最后一张回到第一张位置。

[页面组件](https://github.com/cccccchenyuhao/qqmusic/blob/master/scripts/app.js)： 发送AJAX获取数据渲染页面，事件处理。

性能优化方面ajax加锁，同时只能发送一次。搜索页面每次20条数据，可视区域懒加载，滚动事件节流。

[播放器组件](https://github.com/cccccchenyuhao/qqmusic/blob/master/scripts/player.js): 这块比较复杂的主要是歌词部分

反转义

```javascript
        var temp = document.createElement("div");
        temp.innerHTML = data;
        var output = temp.innerText || temp.textContent;
```

用正则匹配转为数组，歌词添加到text，时间添加到data-time

再转化为对象

audio绑定play时间，添加定时器setInterval，1000

当audio.currentTime与data-time匹配时，当前歌词高亮。

当歌词播放到中间时向上滚动$(‘’p’’).height()

```javascript
$(this).offset().top >= ($('.player-lyric').outerHeight(true) - $('.player-lyric').innerHeight() + $('.player-lyric').height())/2
```

## 总结

本来这个项目是用es6写的，由于我es6和webpack配置还不熟悉，就使用jquery了。

整个项目逻辑还是比较简单的，歌词部分卡了一会儿，最后还是google解决了

静态页面和接口调试时比较耗时间的，需要耐心。

等我es6熟练了可能会回来重构项目


