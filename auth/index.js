import compose from 'koa-compose';
import User from '../api/user/user.model';

var compose = require('koa-compose');
var jwt = require('koa-jwt');

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

    function* attachUserToContext(ctx, next) {
        /*User.findById(this.state.user._id)
            .then(user => {
                if (!user) {
                    return this.status = 401;
                }

                this.state.user = user;

                yield next;
            })
            .catch(function(err) { this.throw(err); });*/
    }

    return compose([authentication, attachUserToContext]);
}