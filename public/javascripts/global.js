//public and global javascript file

$(document).ready(function() {
	var bodyid = $('body').attr('id');

	if (bodyid == 'main') {
		//login button callback
		$('.container button').on('click', userLogin);
	}
});

// callback functions
function userLogin(event) {
	event.preventDefault();

	var curUser = {
		'username' : $('.container input').val()
	}

	//for debug
	console.log('curUser = ' + curUser.username);

 	// Use AJAX to post the object to our adduser service
 	$.ajax({
 	    type: 'POST',
 	    data: curUser,
 	    url: '/users/adduser',	//route/users.js
 	    dataType: 'JSON'
 	}).done(function( response ) {

    		if (response.msg === '') {
	    		window.location.href = '/chatroom';	//redirect to chatroom page

		} else {
			//sth goes wrong
    	    		alert('Error: ' + response.msg);
		}
 	});
}
