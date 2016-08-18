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


module.exports = router;
