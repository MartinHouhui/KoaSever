var localAuth = require('../auth/local');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
exports.login = {
    method: 'post',
    use: localAuth
}

exports.create = {
    method: 'post',
    use: function* (next) {

        var newUser = new User(this.request.body);
        try {
            var user = yield newUser.saveAsync();
            var token = jwt.sign({ _id: user._id }, config.secrets_session, {
                expiresIn: 60 * 60 * 5
            });
            this.body = { success: true, token: token };

        } catch (error) {
            this.throw(422, error);
        }
    }

} 
