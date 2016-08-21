var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
var co = require('co');

function localAuthenticate(User, phonenumber, password, done) {
    co(function* () {
        var user = yield User.findOneAsync({
            $or: [{ 'phonenumber': phonenumber }, { 'name': phonenumber }, { 'email': phonenumber }]
        });
        if (!user) {
            return done(null, false, {
                message: '用户不存在！'
            });
        }
        var authenticated = yield user.authenticate(password);
        return { authenticated: authenticated, usr: user };
    }).then(function (val) {
        if (!val.authenticated) {
            return done(null, false, { message: '密码错误！' });
        } else {
            return done(null, val.usr);
        }
    }, function (err) {
        done(err)
    });

}

exports.setup = function (User) {
    passport.use(new LocalStrategy({
        usernameField: 'phonenumber',
        passwordField: 'password' // this is the virtual field on the model
    }, function (phonenumber, password, done) {
        return localAuthenticate(User, phonenumber, password, done);
    }));
}
