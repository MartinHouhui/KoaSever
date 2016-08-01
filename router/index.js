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
            if (!util.isNullOrUndefined(funcObj.params)) {
                var url = addParam(funcObj.params, controllerUrl, ChildRouter);
                controllerUrl += url;
            }
            if (util.isString(funcObj.url)) {
                controllerUrl = funcObj.url;
            }
        }
        if (excuteFunc !== null) {
            ChildRouter[method](controllerUrl, excuteFunc)
        }
    }
    return ChildRouter;
}


function addParam(params, controllerUrl, ChildRouter) {
    var url = '';
    var excuteFuc = null;
    for (var key in params) {
        url += '/:' + key;
        ChildRouter.param(key, params[key]);
    }
    return url;
}

router.get('/*', function* () {
    yield this.render('noFound');
})


module.exports = router;