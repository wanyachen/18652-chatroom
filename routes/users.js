var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//user login
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    sess = req.session;	//login session
    sess.username = req.body.username;	//sent in POST /user/adduser
    console.log('login session username = ' + sess.username);	//login session
    collection.insert(req.body, function(err, result){
       res.send(
           (err === null) ? { msg: '' } : { msg: err }
       );
    });

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
