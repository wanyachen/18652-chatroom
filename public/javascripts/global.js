//public and global javascript file
var myApp = (function () {
	var curUser = {};	//private, accessible to functions in myApp
	var socket = io();

	//++++++ private functions ++++++
	//only accessible in myApp scope
	function sendFunction(data) {
	     socket.emit('new message', data);
	}
	// 'chat message' is for the id of the socket and $('#new-area') is for the text area
	socket.on ('connect', function() {
	
		//clean up
		console.log('client side socket is connected');
	
		socket.on('chat message', function(msg){
		     console.log('client socket get ACK');
		     if (!jQuery.isEmptyObject(curUser)) {
		     	//receive broadcast, renderPost
			//update content here
		     	renderPost(msg.username, msg.timestamp, msg.content);
		     }
		});
	});

	function renderPost(username, timestamp, content) {
	
	    //for debug
	    console.log('renderPost is triggered...');
	
	    //render layout
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
	//------ private functions ------
	
	//++++++ export functions ++++++
	return {
		userLogin: function() {
			//access private variable
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
					//modal.show
					$('#myModal').modal('show');

				} else {
					//sth goes wrong
    			    		alert('Error: ' + response.msg);
				}
 			});
		
		},
		userLogout: function(/*event*/) {
//			event.preventDefault();

			curUser = {};	//clean up
			window.location.href = '/logout';	//redirect to logout page
		
		},
		uploadPost: function() {
    			//save the post to database

    			var text = $('#comment').val();
    			var tim = new Date();
    			var formatted = formatDate(tim);

    			var newPost = {
    			    'username': curUser.username,
    			    'timestamp': formatted,
    			    'content': text
    			}

    			//for debug
    			//console.log('uploadPost is triggered...');

    			//notify other clients using socket.io
    			sendFunction(newPost);

    			//upload the post to server
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
    			    	console.log("user = " + response.user);	
    			    },
    			});
    			//clean up the textarea
    			$('#comment').val('');
		
		},
		getAllPosts: function() {
	    		var tableContent = '';
	    		// jQuery AJAX call for JSON
	    		$.getJSON( '/users/postlist', function( data ) {
	
	    			// For each item in our JSON, add a table row and cells to the content string
	    			$.each(data, function(){
//	    			    //for debug
//	    			    console.log("user = " + this.username);
//	    			    console.log("timestamp = " + this.timestamp);
//	    			    console.log("content = " + this.content);
	    			    renderPost(this.username, this.timestamp, this.content);
	
	    			});
	    		    
	    		});
		
		}
	
	};
	//------ export functions ------

})();	//invoke myApp itself 

$(document).ready(function() {

	//render old posts
	$('#myModal').on('shown.bs.modal', function (e) {
		// do something...
		myApp.getAllPosts();
	});
	$('#myModal').on('hidden.bs.modal', function (e) {
		myApp.userLogout();
		//alert('hidden event is triggerred');
	});
});

