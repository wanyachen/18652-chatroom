var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');	//manage login session
var socket_io = require('socket.io');	//socket

//var routes = require('./routes/index');	//socket
var users = require('./routes/users');
var logout = require('./routes/logout');	//customized route

// Database support:
//// store messages
//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/chatroom');
//mongoose +++
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/chatroom';
var mongoose = require('mongoose');
var connection = mongoose.createConnection(dbUrl);
connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', function callback() {
	console.info('connected to database');
});
//var models = require('./models');
//var userSchema = new mongoose.Schema({username: 'string'}, {collection: 'userlist'});
var userSchema = new mongoose.Schema({username: 'string'});
var Users = mongoose.model('User', userSchema);
//var postSchema = new mongoose.Schema({username: 'string', timestamp: 'string', content: 'string'}, {collection: 'postlist'});
var postSchema = new mongoose.Schema({username: 'string', timestamp: 'string', content: 'string'});
var Posts = mongoose.model('Post', postSchema);

//function db(req, res, next) {
//	req.db = {
//		User: connection.model('User', models.User, 'users'),
//		Post: connection.model('Post', models.Post, 'posts')
//	};
//	return next();
//}
//mongoose ---

var app = express();
//socket +++
var io = socket_io();
app.io = io;
//socket ---

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// important!
// Make our db accessible to our router
//app.use(function(req,res,next){
//    req.db = db;
//    next();
//});
//mongoose +++
app.use(function (req, res, next) {
	req.db = {
		User: connection.model('User', /*models.User*/Users, 'users'),
		Post: connection.model('Post', /*models.Post*/Posts, 'posts')
	};
	next();
});
//mongoose ---

//routers
app.use(session({secret: 'thisisahomeworkof18652'}));	//manage login session
//socket +++
var routes = require('./routes/index')(io);
app.param('parent_io', function(req, res, next, io) {
  console.log("@bug param", io);
  next();
});
app.use('/', routes);
//socket ---
app.use('/users', users);

////socket +++
//var chatroom = require('./routes/chatroom')(io);
//app.param('parent_io', function(req, res, next, io) {
//  console.log("@bug param", io);
//  next();
//});
//app.use('/chatroom', chatroom);	//chatroom page
////socket ---
app.use('/logout', logout);	//exit link

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//socket +++
io.on('connection', function(socket) {
	console.log('A chatroom user connected');
	socket.on('connect', function() {
		console.log('user connect');
	});
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
//	socket.on('chat message', function(msg) {
//		console.log('message: ' + msg);
//		io.emit('chat message', msg);	//broadcast
//	});
//
//	//for debug
//	socket.on('error', function (err) {
//		if (err.description) throw err.description;
//		else throw err;
//	});
});
//socket ---

//mongoose +++
var exitFunc = function() {
	mongoose.connection.close(function() {
		console.log('node js exit');
		process.exit(0);
	});
}
process.on('exit', exitFunc);
process.on('SIGINT', exitFunc);
//mongoose ---

module.exports = app;
