var auth = require('../auth/service');
var User = require('../model/user');
exports.me =
    {
        method: 'get',
        use: [
            auth.isAuthenticated(),//middleware
            function* () {
                var userId = this.state.user._id;
                try {
                    var user = yield User.findOneAsync({ _id: userId }, '-password -salt');

                    if (!user) {
                        this.throw(401);
                    }

                    this.body = {
                        success: true, user: user
                    }
                }
                catch (error) {
                    this.throw(422, error);
                }
            }]
    }
