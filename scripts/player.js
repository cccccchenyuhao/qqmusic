function Player() {
    this.audio = new Audio()
    this.audio.autoplay = true
    this.init()
}

Player.prototype = {
    constructor: Player,
    init: function () {
        this.lyricScroll = 0
        this.bind()
    },
    slideDown: function () {
 
        $('.player').slideDown('fast',function () {
            $('.btn-slideup').css('display', 'block')
            $('.tab-wrap').css('display', 'none')
            $('header').css('display', 'none')
        })
    },
    slideUp: function () {
        $('.btn-slideup').css('display', 'none')
        $('.tab-wrap').css('display', 'block')
        $('header').css('display', 'block')
        $('.player').slideUp()
    },
    bind: function () {
        var _this = this
        $('.btn-player').click(function () {
            _this.slideDown()
        })
        $('.btn-slideup').click(function () {
            _this.slideUp()
        })
        $('.search-item ul').on('click', 'li', function () {
            _this.lyricScroll = 0
            var songid = $(this).attr('data-songid')
            var songmid = $(this).attr('data-songmid')
            var coverid = $(this).attr('data-coverid')
            var song = $(this).attr('data-songname')
            var singer = $(this).attr('data-singer')

            $('.lyric-wrap').html('')
            var coverurl = "https://y.gtimg.cn/music/photo_new/T001R150x150M000" + coverid + ".jpg?max_age=2592000"
            _this.getLyric(songid)
            _this.slideDown()
            _this.audio.src = `http://dl.stream.qqmusic.qq.com/C100${songmid}.m4a?fromtag=38&guid=7717704106`
            $('.head-cover').css('background-image', `url(${coverurl})`)
            $('.head-info>h3').text(song)
            $('.head-info>p').text(singer)

            $('.lyric-wrap').css({
                "transition": "-webkit - transform 0.3s ease-out 0s",
                "transform-origin": "0px 0px 0px",
                "transform": `translate3d(0px, 0px, 0px)`
            })
            if ($(this).hasClass('icon-play')) {
                $(this).removeClass('icon-play').addClass('icon-pause')
            }
        })
        this.audio.addEventListener('play', function () {
            
            _this.clock = setInterval(function () {
                var min = Math.floor(_this.audio.currentTime / 60) + ''
                var sec = Math.floor(_this.audio.currentTime % 60) + ''
                sec = sec.length === 2 ? sec : '0' + sec
                min = min.length === 2 ? min : '0' + min
                var t = min + ":" + sec
                $('.lyric-wrap p').each(function (el) {
                    if($(this).data('time') === t){
                        $(this).css('color', '#31c27c')
                        $(this).siblings().css('color','rgba(0,0,0,.9)')
                        if ($(this).offset().top >= ($('.player-lyric').outerHeight(true) - $('.player-lyric').innerHeight() + $('.player-lyric').height())/2 ) {
                            _this.lyricScroll -= $(this).height()
                            $('.lyric-wrap').css({
                                "transition": "-webkit-transform 0.3s ease-out 0s",
                                "transform-origin": "0px 0px 0px",
                                "transform": `translate3d(0px, ${_this.lyricScroll}px, 0px)`
                            })
                        }
                        
                    }
                })
                _this.progress()
            }, 1000)
  
        })
        $('.head-play').click(function () {
            if ($(this).hasClass('icon-play')) {
                $(this).removeClass('icon-play').addClass('icon-pause')
                _this.audio.play()
            } else {
                $(this).addClass('icon-play').removeClass('icon-pause')
                _this.audio.pause()
                clearInterval(_this.clock)
            }
        })
    },
    getLyric: function (songid) {
        var _this = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `https://app-qqmusicapi.wedeploy.io/lyric?id=${songid}`, true)
        xhr.onload = function () {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                _this.setLyric(JSON.parse(xhr.responseText).lyric)
            } else {
                console.log('服务器异常')
            }
            _this.isloading = false
        }
        xhr.onerror = function () {
            console.log('服务器异常')
        }
        xhr.send()
    },
    setLyric: function (data) {
        //data是转义后的歌词字符串，需要反转义
        var temp = document.createElement("div");
        temp.innerHTML = data;
        var output = temp.innerText || temp.textContent;

        //去掉没有歌词的时间轴
        var arr = []
        var lineArr = output.split('\n')
        lineArr.forEach(function (line) {
            if (line.replace(/\[.+?\]/g, '')) {
                arr.push(line)
            }
        })
        var obj = {}
        arr.forEach(function (line) {
            if (line.match(/\d{2}:\d{2}/g)) {
                line.match(/\d{2}:\d{2}/g).forEach(function (time) {
                    obj[time] = line.replace(/\[.+?\]/g, '')
                })
            }

        })
        this.renderLyric(arr, obj)
    },
    renderLyric: function (arr, obj) {
        this.arr = arr
        this.obj = obj
        var str = ''
        arr.forEach(function (line, idx) {
            if (line.replace(/\[.+?\]/g, '')) {
                str += `<p data-time=${line.match(/\d{2}:\d{2}/g)}>${line.replace(/\[.+?\]/g, '')}</p>`
            }
        })
        $('.lyric-wrap').append(str)
        $('.lyric-wrap').css({
            "transition":"-webkit - transform 0.3s ease-out 0s",
            "transform-origin": "0px 0px 0px",
            "transform": `translate3d(0px, 0px, 0px)`
        })
    },
    progress: function () {
        //当前时间
        var min = Math.floor(this.audio.currentTime / 60) + ''
        var sec = Math.floor(this.audio.currentTime % 60) + ''
        this.sec = sec.length === 2 ? sec : '0' + sec
        this.min = min.length === 2 ? min : '0' + min

        //总时长
        var min2 = Math.floor(this.audio.duration / 60) + ''
        var sec2 = Math.floor(this.audio.duration % 60) + ''
        this.sec2 = sec2.length === 2 ? sec2 : '0' + sec2
        this.min2 = min2.length === 2 ? min2 : '0' + min2

        var rate = (this.audio.currentTime/this.audio.duration)*100 + '%'
        $('.curr-time').text(this.min + ':' + this.sec)
        $('.total-time').text(this.min2 + ':' + this.sec2)
        $('.progress-bar').css("width", rate)
    }
}

var player = new Player()

// http://dl.stream.qqmusic.qq.com/C400002I3Nwa4f9xqA.m4a?guid=7717704106&vkey=056FB2F3D3B01568732E9A0AE58CCE3EB74A300C91D853F8C29FA2999C55CD2538C29F830DF6F91E10331B7E1D626E0C0433571B5E5AB31A&uin=0&fromtag=38
// http://dl.stream.qqmusic.qq.com/C400001nJ9Uw3wOQ4G.m4a?guid=7717704106&vkey=F0FBBBCB2CD0D2916D7938C1189BA93C92A9DC96DFD73663B2BF47D0F5A3EE4145F5947FF53A69D3649FCBCD02CC2E8C2AE730AD8FE4E04E&uin=0&fromtag=38