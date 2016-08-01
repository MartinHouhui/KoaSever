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
        },
        bb: function* (bb, next) {
            this.bb = bb;
            yield next;
        }
    },
    use: function* () {
        this.body = { aa: this.aa, bb: this.bb };
    }
}