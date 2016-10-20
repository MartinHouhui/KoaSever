'use strict';

var passport = require('koa-passport');
var signToken = require('../service').signToken;

var User = require('../../model/user');

// Passport Configuration
require('./passport').setup(User);

module.exports = function* (next) {
    var me = this;
    yield passport.authenticate('local', function* (err, user, info) {
        var error = err || info;
        if (error) {
           me.body = {success: false, message: error.message };
            return;
        }
        if (!user) {
            me.throw(404, 'Something went wrong, please try again.');
            return;
        }

        var token = signToken(user._id, user.role);
        me.body = {success: true, token: token };
    }).bind(me)(next);
}
