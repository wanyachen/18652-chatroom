//public and global javascript file
var curUser = {};	//global

var socket = io();

//define functions socket.emit sending to server (app.js) and socket.on receiving 
// 'new message' is for the id of the socket and $('#new-message') is for the button
function sendFunction(data) {
     socket.emit('new message', data);
}
// 'chat message' is for the id of the socket and $('#new-area') is for the text area
socket.on('chat message', function(msg){
     //$('#messages-area').append($('<li>').text(msg));
     console.log('client socket get ACK');
     //receive broadcast, renderPost
     renderPost(msg.username, msg.timestamp, msg.content);	//update content here
});


$(document).ready(function() {
//	var bodyid = $('body').attr('id');

//	if (bodyid == 'main') {
		//login button callback
//		$('.container button').on('click', userLogin);
//	} else if (bodyid == "chat") {
		//chatroom page
//		console.log('in chatroom page, username = ' + curUser.username);	//for debug

		//button callback
    		//$('#postbtn').on('click', uploadPost);	//in chatroom.jade
    		//$('#logout').click(function() {
		//    console.log('logout link is clicked');
		//    window.location.href = '/';	//relative ?
		//});
//	}

	//render old posts
	$('#myModal').on('shown.bs.modal', function (e) {
		// do something...
		getAllPosts();
	});
		$('#logout').on('click', userLogout);
});

// ---------------------- callback functions ----------------------------
//function userLogin(event) {
function userLogin() {
//	event.preventDefault();

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
	    		//window.location.href = '/chatroom';	//redirect to chatroom page
			//modal.show
			$('#myModal').modal('show');

		} else {
			//sth goes wrong
    	    		alert('Error: ' + response.msg);
		}
 	});
}

function userLogout(event) {
	event.preventDefault();

	window.location.href = '/logout';	//redirect to logout page
}

// Upload post
//function uploadPost(event) {
function uploadPost() {
//    event.preventDefault();

    //1. save to database
    //2. update article in page.jade

    var text = $('#comment').val();
    var tim = new Date();
    var formatted = formatDate(tim);

    //var formatted = $.datepicker.formatDate("M d, yy", new Date());

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

    //socket
    sendFunction(newPost);

    //get username from server ??
    $.ajax({
        type: 'POST',
        data: newPost,
        url: '/users/upload',	//modal
        dataType: 'JSON',
	statusCode : {
		500: function(response) {
			alert('Error: ' + response.body);
		}
	}, 
	success: function(response) {
		//console.log("user = " + response.user + ", newUser.username = " + newUser.username);	
		console.log("user = " + response.user);	
//    		renderPost(response.user, /*tim,*/formatted, text);	//update content here
		//delay post, until receive broadcast socket
	},
    });
    //clean up
    $('#comment').val('');
 
}

// ---------------------- helper functions ----------------------------
// render old posts
function getAllPosts() {
	
    // Empty content string
    var tableContent = '';
//    console.log("getAllPosts ... ");

    // jQuery AJAX call for JSON
    $.getJSON( '/users/postlist', function( data ) {

    	// For each item in our JSON, add a table row and cells to the content string
    	$.each(data, function(){
    	    //for debug
    	    console.log("user = " + this.username);
    	    console.log("timestamp = " + this.timestamp);
    	    console.log("content = " + this.content);
    	    renderPost(this.username, this.timestamp, this.content);

    	});
	
    });
};

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
    //$('div#msg').prepend(layout);
    $('div#msg').append(layout);

}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "." + date.getDate() + "." + date.getFullYear() + "  " + strTime;
}
