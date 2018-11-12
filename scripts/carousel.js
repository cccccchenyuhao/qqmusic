function Carousel($ct) {
    this.init($ct)
    this.autoPlay()
}

Carousel.prototype = {
    constructor: Carousel,
    init: function ($ct) {
        this.$ct = $ct
        this.$imgCt = this.$ct.find('.img-ct')
        this.$imgs = this.$ct.find('.img-ct > li')
        this.$dots = this.$ct.find('.dot-wrap > b')

        this.imgCount = this.$imgs.length
        this.imgWidth = this.$imgs.width()
        this.imgHeight = this.$imgs.height()
        this.ctWidth = this.imgCount * this.imgWidth

        this.$imgCt.append(this.$imgs.first().clone())
        this.$imgCt.prepend(this.$imgs.last().clone())
        this.$ct.css('height', this.imgHeight)
        this.$imgCt.css('width', (this.imgCount + 2) * this.imgWidth)
        this.$imgCt.css('left', -this.imgWidth)

        this.pageIdx = 0
        this.isAnimate = false
    },
    playNext: function () {
        var _this = this
        if (this.isAnimate) return
        this.isAnimate = true
        this.$imgCt.animate({
            left: '-=' + _this.imgWidth
        }, function () {
            _this.pageIdx += 1
            if (_this.pageIdx === _this.imgCount) {
                _this.$imgCt.css('left', -_this.imgWidth)
                _this.pageIdx = 0
            }
            _this.isAnimate = false
            _this.setDot()
        })
    },
    setDot: function () {
        this.$dots.eq(this.pageIdx).addClass('active').siblings().removeClass('active')
    },
    autoPlay: function () {
        var _this = this
        this.clock = setInterval(function () {
            _this.playNext()
        }, 5000)
    },
    stopAutoPlay: function () {
        clearInterval(this.clock)
    }
}
window.Carousel = Carousel
