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
    		//$('#postbtn').on('click', uploadPost);
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

//    var table = $('<table></table>').addClass('msgbox');
//    var row1 = $('<tr></tr>').addClass('item').text(username).css({"background-color": "yellow", "width" : "50%"});
//    var row2 = $('<tr></tr>').addClass('item').text(timestamp).css({"background-color": "red", "width" : "50%", "text-align": "right", "margin-top" : "0"});
//    var row3 = $('<tr></tr>').addClass('item').text(content).css({"background-color": "lightblue", "width" : "50%", "margin-top" : "0"});
//
//    table.append(row1, row2, row3);
//    $('#postthread').prepend(table);	//newest is on the top

    //for debug
    //add to fixed panel
    //for debug
    console.log('renderPost is triggered...');
    //$('.panel.panel-default .panel-heading .panel-title').text(username);
    $('.panel.panel-default .panel-heading p:first').text(username);
    $('.panel.panel-default .panel-heading p:last').text(timestamp).css({'text-align': "right"});
    //$('#datepicker').text(timestamp);
    //$('#datepicker').datetimepicker({timeFormat: "hh:mm tt"});
    $('.panel.panel-default .panel-body').text(content);
}

