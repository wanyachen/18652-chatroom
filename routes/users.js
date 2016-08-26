var express = require('express');
var router = express.Router();
var sess;	//global, manage login session

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//user login
router.post('/adduser', function(req, res) {
    var db = req.db;

    sess = req.session;	//login session
    sess.username = req.body.username;	//sent in POST /user/adduser
    console.log('login session username = ' + sess.username);	//login session
    //mongoose +++
    var newUser = new db.User(req.body);
    newUser.save(function(err, product, numAffected) {
    	res.send(
		(err === null) ? {msg: ''} : {msg: err}	
	);
    });
    //mongoose ---

});

//save the post to db
router.post('/upload', function(req, res) {
    var db = req.db;
    //for debug
//    console.log('/upload : session.username = ' + /*req.session.username*/sess.username);
    req.body.username = sess.username;	//update ??
    //mongoose +++
    var newPost = new db.Post(req.body);
    newPost.save(function(err, product, numAffected) {
	//heyq, send username to client
	if (err === null) {
//		console.log("db.Post update success: " + sess.username);
		res.json({user: sess.username});
	} else {
//		console.log("db.Post update fail: " + sess.username);
		res.status(500);	//internal server error
		res.send(err);
	}
    });
    //mongoose ---
});

//global.js request for all posts
router.get('/postlist', function(req, res) {
    var db = req.db;
    //mongoose +++
    db.Post.find({}, {}, function(err, docs) {
        res.json(docs);	//send to global.js
    });
    //mongoose ---
});

module.exports = router;
