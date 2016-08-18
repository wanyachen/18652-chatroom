//public and global javascript file
var curUser = {};	//global

$(document).ready(function() {
	var bodyid = $('body').attr('id');

	if (bodyid == 'main') {
		//login button callback
		$('.container button').on('click', userLogin);
	} else if (bodyid == "chat") {
		//chatroom page
		console.log('in chatroom page, username = ' + curUser.username);	//for debug

		//button callback
    		//$('#postbtn').on('click', uploadPost);	//in chatroom.jade
    		//$('#logout').click(function() {
		//    console.log('logout link is clicked');
		//    window.location.href = '/';	//relative ?
		//});
	}
});

// ---------------------- callback functions ----------------------------
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

// Upload post
//function uploadPost(event) {
function uploadPost() {
//    event.preventDefault();

    //1. save to database
    //2. update article in page.jade

    var text = $('#comment').val();
    //var tim = Date();

    var formatted = $.datepicker.formatDate("M d, yy", new Date());

    //upload to server
    // If it is, compile all user info into one object
    var newPost = {
        //'username': '',	//wait for server
        'username': curUser.username,
	//'timestamp': tim,
	'timestamp': formatted,
	'content': text
    }

    //for debug
    console.log('uploadPost is triggered...');

    //get username from server ??
    $.ajax({
        type: 'POST',
        data: newPost,
        url: '/chatroom/upload',
        dataType: 'JSON',
	statusCode : {
		500: function(response) {
			alert('Error: ' + response.body);
		}
	}, 
	success: function(response) {
		//console.log("user = " + response.user + ", newUser.username = " + newUser.username);	
		console.log("user = " + response.user);	
    		renderPost(response.user, /*tim,*/formatted, text);	//update content here
	},
    });
 
}

// ---------------------- helper functions ----------------------------
function renderPost(username, timestamp, content) {

    //for debug
    console.log('renderPost is triggered...');

//    $('.panel.panel-default .panel-heading p:first').text(username);
//    $('.panel.panel-default .panel-heading p:last').text(timestamp).css({'text-align': "right"});
//    $('.panel.panel-default .panel-body').text(content);

    var layout = '';
    layout += '<div class=row>\n';
    layout += '  <div class="col-md-4">\n';
    layout += '    <div class="panel panel-default">\n';
    layout += '      <div class="panel-heading">\n';
    layout += '        <p>';
    layout += username;
    layout += '        </p>\n';
    layout += '        <p align="right">';
    layout += timestamp;
    layout += '        </p>\n';
    layout += '      </div>\n';
    layout += '      <div class="panel-body">';
    layout += content;
    layout += '      </div>\n';
    layout += '    </div>\n';
    layout += '  </div>\n';
    layout += '  <div class="col-md-4"></div>\n';
    layout += '  <div class="col-md-4"></div>\n';
    layout += '</div>\n';
    //$('div#msg').html(layout);
    $('div#msg').prepend(layout);

}

