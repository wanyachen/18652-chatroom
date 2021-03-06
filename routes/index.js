module.exports = function(io) {
	var express = require('express');
	var router = express.Router();
	
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
			//console.log('message: ' + msg);
			console.log('message: ' + msg.content);
//			msg.content += '[this is from socket.io]';	//for debug
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
