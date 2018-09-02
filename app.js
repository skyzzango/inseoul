const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const flash = require("connect-flash"); // 1
const session = require("express-session"); // 1
const mongoose = require('mongoose');
const passport = require("./config/passport"); // 1
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();

// view engine setup
// .set (서버 설정을 위한 속성을 지정)
app.set('views', path.join(__dirname, 'views')); // views : 뷰들이 들어 있는 폴더 또는 폴더 배열을 설정
app.set('view engine', 'ejs'); // view engine : 디폴트로 사용할 뷰 엔진을 설정

// use() : 미들웨어 함수를 사용
// 1. use()는 미들웨어 설정으로 라우터와 같이 하나의 독립된 기능을 가진 함수라고 봐도 된다.
// 2. 즉 웹 요청과 응답에 관한 정보를 사용해 필요한 처리를 진행할 수 있도록 독립된 함수.
// 3. 각각의 미들웨어는 모두 next() 메소드를 호출하여 그 다음 미들웨어로 넘어가게 된다.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash()); // 2
app.use(session({
	secret           : '@#@$MYSIGN#@$#$',
	resave           : false,
	saveUninitialized: true,
	cookie           : {secure: true}
}));

// Passport // 2
app.use(passport.initialize());
app.use(passport.session());

// Custom MiddleWares // 3
app.use(function (req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser = req.user;

	console.log('커스텀 미들웨어 체킹', req.user);
	console.log('커스텀 미들웨어 체킹', req.isAuthenticated());

	next();
});

// Router
// 1. 라우터는 클라이언트의 요청 path 를 보고 이 요청 정보를 처리할 수 있는 곳으로 기능을 전달해 주는 역할(라우팅)
// 2. 즉 url 에서 localhost/user 라면 /user 를 처리해줄 get 방식의 라우터를 찾아 처리 후 응답
app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

