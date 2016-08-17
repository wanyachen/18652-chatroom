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

module.exports = router;
