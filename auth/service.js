var compose = require('koa-compose');
var jwt = require('koa-jwt');

var config = require('../config/config');

//var User = require('../model/User'); //获取User

var validateJwt = jwt({
    secret: config.secrets_session
});

/**
* Attaches the user object to the request if authenticated
* Otherwise returns 403
*/
exports.isAuthenticated = function () {
    function* authentication(next) {
        // allow access_token to be passed through query parameter as well
        if (this.query && this.query.hasOwnProperty('access_token')) {
            this.headers.authorization = 'Bearer ' + this.query.access_token;
        }

        yield validateJwt(next);
    }

    function* attachUserToContext(next) {

        var user = yield User.findByIdAsync(this.state.user._id);
        if (!user) {
            this.throw(401);
        }
        this.state.user = user;
        yield next;
    }

    return compose([authentication, attachUserToContext]);
}

exports.hasRole = function (roleRequired) {
    if (!roleRequired) {
        this.throw('Required role needs to be set');
    }

    return compose([exports.isAuthenticated(), function* (next) {
        if (codeTable.User.Role.indexOf(req.user.role) <=
            codeTable.User.Role.indexOf(roleRequired)) {
            yield next;
        } else {
            this.throw(403, 'Forbidden');
        }
    }])
}


/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = function (id, role) {
    return jwt.sign({ _id: id, role: role }, config.secrets_session, {
        expiresIn: 60 * 60 * 5
    });
}