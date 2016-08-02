


exports.params = {
    aa: function* (aa, next) {
        this.aa = aa + 'test';
        yield next;
    },
    bb: function* (bb, next) {
        this.bb = bb + 'test';
        yield next;
    }
} //controller 全局处理 params

exports.actions = { //如果有 全局的params 必须有actions
    test: function* () {
        yield this.render('index', { "title": "koa demo" }); //action 默认为function 他的method 默认为GET
    },

    save: function* () {
        this.body = 'ko'
    },

    testbb: {
        url: '/fuck/:aa/test',//如果定义了 url，不会再通过 function name 去转化 url
        method: 'get',
        use: ['aa', 'bb',function* () { // use 定义成array 形式，字符就代表着 params ，如果use是function，说明没有参数
             this.body = { aa: this.aa, bb: this.bb };
        }]
    },

    testaa: {
        method: 'get',
        use: function* () {
            this.body = '没有参数';
        }
    }
}