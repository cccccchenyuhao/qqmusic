function Tab(node) {
    this.node = node
    this.init()
}
Tab.prototype = {
    constructor: Tab,
    init: function () {
        this.bind()
    },
    bind: function () {
        this.node.querySelectorAll('nav > a').forEach(function (aNode, index) {
            aNode.onclick = function () {
                console.log(index)
                this.parentElement.querySelectorAll('a').forEach(function (node) {
                    node.classList.remove('active')
                })
                this.classList.add('active')
                document.querySelectorAll('#content-wrap .panel').forEach(function (panel, idx) {
                    panel.classList.remove('active')
                    if (idx === index) {
                        panel.classList.add('active')
                    }
                })
            }
        })
    }
}
var tab1 = new Tab(document.querySelectorAll('.tab-wrap')[0]);
