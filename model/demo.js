
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var DemoSchema = new Schema({
    key: { type: String, index: { unique: true } },
    content: String,
    expiredTime: {
        type: Date, default: Date.now()
    }
});

module.exports = mongoose.model('Demo', DemoSchema);