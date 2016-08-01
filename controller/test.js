exports.test = function* () {
    yield this.render('index', { "title": "koa demo" });
}

exports.save = function* () {
    this.body = 'ko'
}

exports.aa = function* () {
    this.body = 'ko'
}

exports.bb = function* () {
    this.body = 'bb'
}

exports.testaa = {
    method: 'get',
    params: {
        aa: function* (aa, next) {
            this.aa = aa;
            yield next;
        }
    },
    use: function* () {
        this.body = this.aa
    }
}