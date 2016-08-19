var express = require('express');
var router = express.Router();
var sess;	//global, manage login session

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('chatroom');
	
	//extract username
	sess = req.session;
	console.log("in chatroom, username = " + sess.username);
});

//save the post to db
router.post('/upload', function(req, res) {
    var db = req.db;
    var collection = db.get('postlist');
    //req.body : JSON data
    //{username, timestamp, content}
    req.body.username = req.session.username;	//update ??
    collection.insert(req.body, function(err, result){
	//heyq, send username to client
	if (err === null) {
		console.log("collection insert success: " + sess.username);
		res.json({user: sess.username});
	} else {
		console.log("collection insert fail: " + sess.username);
		res.status(500);	//internal server error
		res.send(err);
	}
    });
});


module.exports = router;
