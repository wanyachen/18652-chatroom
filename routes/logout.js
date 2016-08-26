var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	req.session.destroy(function(err) {
		if(err) {
		    console.log(err);
		} else {
		    res.redirect('/');
		    console.log("logout successfully");
		}
	});
});

module.exports = router;

