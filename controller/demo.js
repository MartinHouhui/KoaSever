exports.test = function* () {
    yield this.render('index', { "title": "koa demo" });
}

exports.save = function* () {
    this.body = 'ko'
}

exports.testbb = {
    url: '/fuck/:aa/test',
    method: 'get',
    use: ['aa', function* () {
        this.body = this.params;
    }]
}

exports.testaa = {
    method: 'get',
    use: ['aa', 'bb',
        function* (next) {
            this.hh = 'test';
            yield next;
        },//middleware
        function* () {
            this.body = this.hh;
        }]
}
 //没有全局处理param，可以继续以前的写法