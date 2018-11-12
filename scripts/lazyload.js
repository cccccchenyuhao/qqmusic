function isShow() {
    return $('.load').offset().top <= $(window).height() + $(window).scrollTop()
}
function lazyLoad() {
    if (isShow()) {
        getData(render)
    }
}
lazyLoad()
// 绑定滚动事件
$(window).on('scroll', function () {
    debounce(lazyLoad(), 500)
})

//滚动事件节流
function debounce(func, delay) {
    var timeout
    return function () {
        clearTimeout(timeout)
        var context = this,
            args = arguments,
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, delay)
    }
}


function Lazyload() {
    this.$load = $('#load')
    this.isShow = function () {
        return $('#load').offset().top <= $(window).height() + $(window).scrollTop()        
    }
}

LazyLoad.prototype = {
    constructor: Lazyload,
    init: function () {

    },
    bind: function () {
        $(window).on('scroll', function () {
            debounce(lazyLoad(), 500)
        })
    },
    debounce

}