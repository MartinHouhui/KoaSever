'use strict';

var crypto = require('crypto');
var codeTable = require('./CodeTable');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    phonenumber: String,
    wechatdetail: {
        subscribe: String,
        openid: String,
        nickname: String,
        sex: String,
        city: String,
        province: String,
        country: String,
        headimgurl: String,
        subscribe_time: Date,
        unionid: String,
        groupid: String
    },
    name: String,
    salt: String,
    email: {
        type: String,
        lowercase: true
    },
    role: {
        type: String,
        enum: codeTable.User.Role,
        default: 'User'
    },
    password: String
});


/**
 * Virtuals
 */

// Public profile information
UserSchema
    .virtual('profile')
    .get(function () {
        return {
            'name': this.name,
            'role': this.role
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function () {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('phonenumber')
    .validate(function (email) {
        return email.length;
    }, 'Email cannot be blank');

// Validate empty email
UserSchema
    .path('name')
    .validate(function (email) {
        return email.length;
    }, 'name cannot be blank');

// Validate empty password
UserSchema
    .path('password')
    .validate(function (password) {
        return password.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('phonenumber')
    .validate(function (value, respond) {
        var self = this;
        return this.constructor.findOneAsync({ phonenumber: value })
            .then(function (user) {
                if (user) {
                    if (self.id === user.id) {
                        return respond(true);
                    }
                    return respond(false);
                }
                return respond(true);
            })
            .catch(function (err) {
                throw err;
            });
    }, 'The specified email address is already in use.');


UserSchema
    .path('name')
    .validate(function (value, respond) {
        var self = this;
        return this.constructor.findOneAsync({ name: value })
            .then(function (user) {
                if (user) {
                    if (self.id === user.id) {
                        return respond(true);
                    }
                    return respond(false);
                }
                return respond(true);
            })
            .catch(function (err) {
                throw err;
            });
    }, '这个用户名已存在');

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function (next) {
        // Handle new/update passwords
        if (!this.isModified('password')) {
            return next();
        }

        if (!validatePresenceOf(this.password)) {
            next(new Error('Invalid password'));
        }

        var me = this;

        // Make salt with a callback
        this.makeSalt(function (saltErr, salt) {
            if (saltErr) {
                next(saltErr);
            }
            me.salt = salt;
            me.encryptPassword(me.password, (encryptErr, hashedPassword) => {
                if (encryptErr) {
                    next(encryptErr);
                }
                me.password = hashedPassword;
                next();
            });
        });
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate: function (password, callback) {
        var me = this;

        return new Promise(function (reslove, reject) {
            me.encryptPassword(password, function (err, pwdGen) {
                if (err) {
                    reject(err);
                }

                if (me.password === pwdGen) {
                    reslove(true);
                } else {
                    reslove(false);
                }
            });
        });
    },


    makeSalt: function (byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        }

        if (!byteSize) {
            byteSize = defaultByteSize;
        }

        if (!callback) {
            return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
            if (err) {
                callback(err);
            } else {
                callback(null, salt.toString('base64'));
            }
        });
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
            return null;
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function (err, key) {
            if (err) {
                callback(err);
            } else {
                callback(null, key.toString('base64'));
            }
        });
    }
};

module.exports = mongoose.model('User', UserSchema);