function Recommend() {
    this.init()
}
Recommend.prototype = {
    constructor: Recommend,
    init: function () {
        this.getData()
    },
    getData: function () {
        var _this = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://app-qqmusicapi.wedeploy.io/', true)
        xhr.onload = function () {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                _this.render(JSON.parse(xhr.responseText).data)
            } else {
                console.log('服务器异常')
            }
        }
        xhr.onerror = function () {
            console.log('服务器异常')
        }
        xhr.send()
    },
    render: function (data) {
        //轮播
        var carouselStr = ''
        data.slider.forEach(function (slider, idx) {
            carouselStr += `
                <li><a href="${slider.linkUrl}"><img src="${slider.picUrl}" alt=""></a></li>
                `
        })
        document.querySelector('.img-ct').innerHTML = carouselStr
        document.querySelector('.img-ct img').onload = function () {
            var carousel = new Carousel($('.carousel').eq(0))
        }

        //电台
        var fmStr = ''
        data.radioList.forEach(function (radio, idx) {
            fmStr += `
                    <li>
                        <a href="#">
                            <div class="main">
                                <img src="${radio.picUrl}">
                                <span class="icon icon-play"></span>
                            </div>
                            <div class="info">
                                <h3>${radio.Ftitle}</h3>
                            </div>
                        </a>
                    </li>
                `
        })
        document.querySelector('.radio-wrap').innerHTML = fmStr

        //热门
        var hotStr = ''
        data.songList.forEach(function (song, idx) {
            var hotHref = '//y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id=' + song.id
            hotStr += `
                        <li>
                            <a data-href="${hotHref}">
                                <div class="main">
                                    <img src="${song.picUrl}">
                                    <span class="listen-count"><i class="icon icon-listen"></i>${song.accessnum}</span>
                                    <span class="icon icon-play"></span>
                                </div>
                                <div class="info">
                                    <h3>${song.songListDesc}</h3>
                                    <p>${song.songListAuthor}</p>
                                </div>
                            </a>
                        </li>
                `
        })
        document.querySelector('.hot-wrap').innerHTML = hotStr
    }
}
var recommend = new Recommend()

function Rank() {
    this.init()
}
Rank.prototype = {
    constructor: Rank,
    init: function () {
        this.getData()
    },
    getData: function () {
        var _this = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://app-qqmusicapi.wedeploy.io/rank', true)
        xhr.onload = function () {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                _this.render(JSON.parse(xhr.responseText).data)
            } else {
                console.log('服务器异常')
            }
        }
        xhr.onerror = function () {
            console.log('服务器异常')
        }
        xhr.send()
    },
    render: function (data) {
        var str = ''
        data.topList.forEach(function (item, idx) {
            var rankStr = ''
            item.songList.forEach(function (item, idx) {
                rankStr += `
                    <p>${idx + 1}<span>${item.songname}</span>- ${item.singername}</p>
                `
            })
            str += `
                    <li class="item">
                        <a href="#">
                            <div class="info-wrap clearfix">
                                <div class="info-cover">
                                    <img src=${item.picUrl}
                                        alt="">
                                </div>
                                <div class="info-main">
                                    <h3>${item.topTitle}</h3>
                                    ${rankStr}
                                </div>
                            </div>
                        </a>
                    </li>
        `
        })
        $('#rank-wrap ul').append(str)
    }
}
var rank = new Rank()

function Search() {
    this.init()
}

Search.prototype = {
    constructor: Search,
    init: function () {
        this.$form = $('#searchform')
        this.$input = $('#searchinput')
        this.$cancel = $('#search-wrap .cancel')
        this.n = 20
        this.p = 1
        this.isloading = false
        this.bind()

    },
    lazyLoad: function () {
        var _this = this
        $(window).on('scroll', function () {
            if ($('#isload').offset().top <= $(window).height() + $(window).scrollTop() && $('#isload').offset().top !== 0) {
                _this.getData()
            }
        })
    },
    debounce: function (func, delay) {
        var timeout
        return function () {
            clearTimeout(timeout)
            var context = this,
                args = arguments,
                timeout = setTimeout(function () {
                    func.apply(context, args)
                }, delay)
        }
    },
    bind: function () {
        var _this = this
        this.$form.submit(function (e) {
            $('#isload').css('display', 'block')
            _this.keyword = $('#searchinput').val()
            _this.p = 1
            $('.search-item ul').html('')
            e.preventDefault()
            _this.getData()
            _this.debounce(_this.lazyLoad(), 500)
        })
        this.$cancel.on('click', function () {
            $(this).addClass('hide')
            $('#searchinput').val('')
            $('.input-wrap').addClass('active')           
        })
        $('#searchinput').focusin(function () {
            $('.cancel').removeClass('hide')
            $('.input-wrap').removeClass('active')
        })
        $('#searchinput').focusout(function () {
            $('.cancel').addClass('hide')
            $('.input-wrap').addClass('active')
        })

    },
    getData: function () {
        if (this.isloading) return
        this.isloading = true
        var _this = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `https://app-qqmusicapi.wedeploy.io/search?w=${_this.keyword}&n=${_this.n}&p=${_this.p}`, true)
        xhr.onload = function () {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                _this.render(JSON.parse(xhr.responseText).data)
                _this.p += 1
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
    render: function (data) {
        var str = ''
        data.song.list.forEach(function (el) {
            var singername = ''
            el.singer.forEach(function (el) {
                singername += el.name + ' '
            })
            str += `
        <li data-songid="${el.songid}" data-songmid="${el.songmid}" data-coverid="${el.singer[0].mid}" data-songname="${el.songname}" data-singer="${el.singer[0].name}">
            <div class="search-info">
                <h6>${el.songname}</h6>
                <p>${singername}</p>
            </div>
            <div class="search-cover"></div>
        </li>
            `
        })
        $('.search-item ul').append(str)
    }
}

var search = new Search()


