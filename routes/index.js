module.exports = function(io) {
	var express = require('express');
	var router = express.Router();
//	var sess;	//global, manage login session
	
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	//socket
	router.param('parent_io', function(req, res, next, parent_io) {
		io = parent_io;
	});
	
	//socket
	io.on('connection', function(socket) {
		console.log('[user.js] user connected');
		
		socket.on('new message', function(msg) {
			console.log('message: ' + msg);
			io.emit('chat message', msg);	//broadcast
		});
	
		//for debug
		socket.on('error', function (err) {
			if (err.description) throw err.description;
			else throw err;
		});
	});
	return router;
}

//module.exports = router;
