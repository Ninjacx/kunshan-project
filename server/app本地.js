var createError = require('http-errors');
const compression = require('compression') //GZIP
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var ejs = require('ejs');
const bodyParser = require('body-parser');
// var weChatRouter = require('./routes/weChat');
var indexRouter = require('./routes/index');
// var menuRouter = require('./routes/menu');
// var forumRouter = require('./routes/forum'); // 关于帖子的接口

// var usersRouter = require('./routes/users');
// 后端管理
// var system = require('./routes/system');

// var activeRouter = require('./routes/active');

var session =require("express-session");

var app = express();

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  //用于判断request来自ajax还是传统请求
  res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
  //允许访问的方式
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  //修改程序信息与版本
  res.header('X-Powered-By', ' 3.2.1')
  //内容类型：如果是post请求必须指定这个属性
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// app.set('view engine','ejs');
// app.engine('html',ejs.__express);
// app.set('view engine','html');
app.use(logger('dev'));
app.use(compression({ threshold: 9 }));//GZIP
app.use(bodyParser.json());
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// app.use(session({
//        secret: 'bqk',
//        name: 'bqk',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
//        cookie: {maxAge: 1000 * 60 * 60 * 24},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期 1天 ，24小时, // 设置 session 的有效时间，单位毫秒
//        resave: false,
//        saveUninitialized: true,
//  }));

// app.use(function(req, res, next){
//     // res.locals.token = req.session.token;
//     // res.locals.nickName = req.session.nickName;
//     // res.locals.page = req.session.page;
//     next();
// });

/* APP 前台接口 */
app.use('/', indexRouter);
// app.use('/weChat', weChatRouter);
// app.use('/menu', menuRouter);
// app.use('/forum', forumRouter);

// app.use('/users', usersRouter);

// H5中的接口汇总
// app.use('/activeRouter', activeRouter);

// app.use('/system', system);
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/static',express.static('/public'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
