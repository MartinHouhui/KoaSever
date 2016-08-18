var localAuth = require('../auth/local');
exports.login = {
    method: 'post',
    use: localAuth
}
