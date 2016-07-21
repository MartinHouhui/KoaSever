exports.index = function* () {
    yield this.render('index', { "title": "koa demo" });
}

exports.bb = function* () {
    this.body = 'ko'
}

exports.aa = function* () {
    this.body = 'aa'
}

exports.kk = function* () {
    this.body = 'll'
}
