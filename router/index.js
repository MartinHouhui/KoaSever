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
    if (!util.isNullOrUndefined(functions.params)) {
        for (var key in functions.params) {
            ChildRouter.param(key, functions.params[key]);
        }
    }

    if (!util.isNullOrUndefined(functions.actions)) {
        addAction(functions.actions, ChildRouter);
    } else if (util.isNullOrUndefined(functions.params)) {
        addAction(functions, ChildRouter);
    }
    return ChildRouter;
}

function addAction(actions, ChildRouter) {
    for (var key in actions) {
        var funcObj = actions[key];
        var method = 'get';
        var excuteFunc = null;
        var controllerUrl = ('/' + key);
        if (util.isFunction(funcObj)) {
            excuteFunc = funcObj;
        } else if (util.isObject(funcObj)) {
            method = funcObj.method;

            if (util.isArray(funcObj.use)) {
                var execObj = analysisUse(funcObj.use);
                controllerUrl += execObj.url;
                excuteFunc = execObj.execF;
            } else if (util.isFunction(funcObj.use)) {
                excuteFunc = funcObj.use;
            }
            if (util.isString(funcObj.url)) {
                controllerUrl = funcObj.url;
            }
        }
        if (excuteFunc !== null) {
            ChildRouter[method](controllerUrl, excuteFunc)
        }
    }
}

function analysisUse(useArray) {
    var url = '';
    var execF = null;
    useArray.forEach(function (item) {
        if (util.isString(item)) {
            url += '/:' + item;
        }
        if (util.isFunction(item)) {
            execF = item;
        }
    });
    return {
        url: url,
        execF: execF
    }
}


router.get('/*', function* () {
    yield this.render('noFound');
})


module.exports = router;