var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var usersRouter = require('./routes/users');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //这个是什么意思

var app = express();

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //bookie name
  cookie: {maxAge: 1000*60*60*24*30},   //30 days
  store: new MongoStore({
    // db: settings.db,
    // host: settings.host,
    // port: settings.port,
    url: 'mongodb://localhost:27017/test'
  })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));  //设置views文件的目录
app.set('view engine', 'ejs');  //设置模板引擎
app.use(flash());

app.use(logger('dev'));   //加载日志中间件,但dev什么意思？
app.use(express.json());  //加载解析json中间件
app.use(express.urlencoded({ extended: false })); //加载urlencoded中间件，解析url地址
app.use(cookieParser());  //加载解析cookie中间件
app.use(express.static(path.join(__dirname, 'public')));  //使用静态中间件，并使public文件夹为存放静态文件的目录

app.use('/', indexRouter);  //路由控制器
app.use('/users', usersRouter); //路由控制器

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
