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