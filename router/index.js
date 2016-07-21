var Router = require('koa-router'),
    router = new Router();
var config = require('../config/config');

var fs = require('fs');
var util = require('util');
var fileFormat = config.controllerDir + '/%s';

fs.readdirSync(config.controllerDir)
    .filter(function (filename) {
        return filename.match(/\.js$/i);
    })
    .map(function (filename) {
        return {
            routerName: filename.match(/([^\/]+)\.js$/)[1],
            functions: require(util.format(fileFormat, filename))
        };
    })
    .forEach(function (controller) {
        var routeUrl = ('/' + controller.routerName);
        router.use(routeUrl, generateRoute(controller.functions).routes());
    });


function generateRoute(functions) {
    var ChildRouter = new Router();
    for (var key in functions) {
        var funcObj = functions[key];
        var method = 'get';
        var excuteFunc = null;
        var controllerUrl = ('/' + key);
        if (util.isFunction(funcObj)) {
            excuteFunc = funcObj;
        } else if (util.isObject(funcObj)) {
            method = funcObj.method;
            excuteFunc = funcObj.use;
        }
        if (excuteFunc !== null) {
            ChildRouter[method](controllerUrl, excuteFunc)
        }
    }
    return ChildRouter;
}

module.exports = router;