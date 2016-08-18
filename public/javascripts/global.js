//public and global javascript file
var curUser = {};	//global

$(document).ready(function() {
	var bodyid = $('body').attr('id');

	if (bodyid == 'main') {
		//login button callback
		$('.container button').on('click', userLogin);
	} else if (bodyid == "chat") {
		//chatroom page
		var user = curUser.username;
		console.log('in chatroom page, username = ' + curUser.username);	//for debug
		$('#name-area').text(user);
		//$('#name-area').html('You are: <span>' + user + '</span>');
		//$('#name-area').html('You are: <span>trying</span>');

		//button callback
    		$('#sendBtn input').on('click', uploadPost);
    		$('#logout').click(function() {
		    console.log('logout link is clicked');
		    window.location.href = '/';	//relative ?
		});
	}
});

// callback functions
function userLogin(event) {
	event.preventDefault();

	//var curUser = {
	curUser = {
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
