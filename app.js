var debug = require('debug')('koaDemo');
var koa = require('koa');
//配置文件
var config = require('./config/config');

var app = koa();
app.use(function* (next) {
    //config 注入中间件，方便调用配置信息
    if (!this.config) {
        this.config = config;
    }
    yield next;
});

//log记录
var Logger = require('mini-logger');
var logger = Logger({
    dir: config.logDir,
    categories: ['message', 'phone'],
    format: 'YYYY-MM-DD-[{category}][.log]'
});

//router use : this.logger.error(new Error(''))
app.context.logger = logger;

var onerror = require('koa-onerror');
onerror(app);

var render = require('koa-ejs');
render(app, {
    //配置模板目录
    root: config.viewDir,
    layout: false,
    viewExt: 'html',
    debug: false,
    cache: true
});




//session中间件
var session = require('koa-session');

app.keys = ['keys', 'koaDemo.sid'];
app.use(session(app));


//post body 解析
//var bodyParser = require('koa-bodyparser');
//app.use(bodyParser());
//数据校验
var validator = require('koa-validator');
app.use(validator());

//静态文件cache
var staticCache = require('koa-static-cache');
var staticDir = config.staticDir;
app.use(staticCache(staticDir));

//应用路由
var appRouter = require('./router');


app.use(appRouter.routes());

app.listen(config.port);
console.log('listening on port %s', config.port);

module.exports = app;

