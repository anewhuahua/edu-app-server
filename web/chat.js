$(document).ready(function() {

	var socket = null;
	var currentUser = null;
	var currentUserNick = null;

	var uid = 1;
	var connCounter = 1;
	var flag = 0;
	reset();

	socket = io();
	socket.on('broadcast', function(msg){
	    	var message = new lib_chat.Message();
	    	data = message.onBroadcast(msg);
	    	appendMessage(formatUser(data.user));
	    	appendMessage("<span>&nbsp;&nbsp;</span>" + data.message);
  	});
  	socket.on('onListUser', function(msg){
  		$("#onlineUsers").html("");
	    	var message = new lib_chat.Message();
	    	data = message.onListUserComplete(msg);
	    	users = data.user;
	    	for (i=0;i<users.length;i++) {
	    		appendUser(users[i]);
	    	}

	    updateUser(users.length); 
	    //console.log(data);
	    //appendUser();
  	});

  	socket.on('onVedioChatCaller', function(msg){
  		var message = new lib_chat.Message();
  		message.onVedioChatCaller(msg);
  	});

  	socket.on('onVedioChatCallee', function(msg){
		console.log("receive private message");
  		appendMessage(formatVedio(msg));
  	});

	function reset() {
		if(socket) {
			socket.close();
		}
		socket = null;
		$("#onlineUsers").html("");
		$("#talkFrame").html("");
		$("#nickInput").val("");
	}

	function updateUser(cnt) {
		$("#userNo").html(""+cnt+" people online now");
	}

	 
	function close() {

	}


   
	$("#open").click(function(event) {
		currentUserNick = $.trim($("#nickInput").val());
		if('' == currentUserNick) {
			alert('请先输入昵称');
			return;
		}
		$("#prePage").hide();
		$("#mainPage").show();
		//reset();

		
		var message = new lib_chat.Message();
		message.login(socket, currentUserNick);

		var message = new lib_chat.Message();
		message.listUser(socket);
	});


	$("#send").click(function(event) {
		var value = $.trim($("#message").val());
		if(value) {
			$("#message").val('');
			appendMessage(formatUser(currentUserNick));
			appendMessage("<span>&nbsp;&nbsp;</span>" + value);
			var message = new lib_chat.Message();
			message.speak(socket, currentUserNick, value);
		}
	});

	//$("#onlineUsers").on('click', '.friends_area', function(){
    // 	console.log("working");
     //str+='$("#'+ msg +'").click(function(event){var this_id = $(this).attr("id"); console.log("this_id");})';
	//});

	$(document).on('click','.friends_area',function(){
		var this_id = $(this).attr("id");
		console.log(this_id);
	    if (this_id != null){
	    	var message = new lib_chat.Message();
			message.vedioChat(socket, this_id);
	    }
	});



	function show(value) {
		$("#response").html(value);
	};
	function formatUser(user) {
		if(!user) {
			return '';
		}
		return "<span class='gray'>(" + user + ")</span> "+ new Date().format("yyyy-MM-dd hh:mm:ss") + " ";
	};
	function formatVedio(msg) {
		var str = "<span class='red'>(this is a vedio chat invite)</span> "+ new Date().format("yyyy-MM-dd hh:mm:ss") + " ";
		str += "</br><span class='gray'>to join, click the link: <a href='" + msg + "'>" + msg + "</a></span>";
		return str;
	}

	function appendMessage(msg) {
		$("#talkFrame").append("<div>" + msg + "</div>");
	}

	function appendUser(msg) {
		//$("#onlineUsers").append("<div>" + msg + "</div>");
 		var str = '<div class="friends_area" id="' + msg + '">'+
				  '<img style="float: left;" src="http://demos.99points.info/fb_friends_list/images/j.jpg" alt="" height="50" />' +
				  '<label class="name" style="float: left;">' +
				  '<strong>'+ msg + '</strong>' +
				  '</label></div></div>';


		$("#onlineUsers").append(str);
	}

	function getVedioUser() {

	}


});


