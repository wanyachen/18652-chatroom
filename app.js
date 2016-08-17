var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');	//manage login session

var routes = require('./routes/index');
var users = require('./routes/users');
var chatroom = require('./routes/chatroom');	//customized route
var logout = require('./routes/logout');	//customized route

// Database support:
// store messages
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/chatroom');

var app = express();

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
app.use(function(req,res,next){
    req.db = db;
    next();
});
//router
app.use('/', routes);
app.use(session({secret: 'thisisahomeworkof18652'}));	//manage login session
app.use('/users', users);
app.use('/chatroom', chatroom);	//chatroom page
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


module.exports = app;
