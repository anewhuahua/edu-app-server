(function(exports) {
	/*
		key: nickname
		data:
		{
			uid:
			conn:
		}
	
	*/ 
	var SimpleMap = exports.SimpleMap = function() {
			this.map = {};
			this.mapSize = 0;
		};

	SimpleMap.prototype.put = function(key, value) {
		var oldValue = this.map[key];
		this.map[key] = value;
		if(!oldValue) {
			this.mapSize++;
		}
		return(oldValue || value);
	};

	SimpleMap.prototype.get = function(key) {
		return this.map[key];
	};

	SimpleMap.prototype.remove = function(key) {
		var v = this.map[key];
		if(v) {
			delete this.map[key];
			this.mapSize--;
		};
		return v;
	};

	SimpleMap.prototype.size = function() {
		return this.mapSize;
	};

	SimpleMap.prototype.clear = function() {
		this.map = {};
		this.mapSize = 0;
	};

	SimpleMap.prototype.keySet = function() {
		var theKeySet = [];
		for(var i in this.map) {
			theKeySet.push(i);
		}
		return theKeySet;
	};

	SimpleMap.prototype.values = function() {
		var theValue = [];
		for(var i in this.map) {
			theValue.push(this.map[i]);
		}
		return theValue;
	};

	var CircleList = exports.CircleList = function(maxSize) {
			this.maxSize = (maxSize || 10);
			this.list = [];
			this.index = null;
		};

	CircleList.prototype.clear = function() {
		this.list = [];
		this.index = null;
	};

	CircleList.prototype.add = function(value) {
		if(null == this.index) {
			this.index = 0;
		}

		this.list[this.index++] = value;

		if(this.index == this.maxSize) {
			this.index = 0;
		}
	};

	CircleList.prototype.values = function() {
		var theValue = [];
		if(null != this.index) {
			if(this.list.length == this.maxSize) {
				for(var i = this.index; i < this.maxSize; i++) {
					theValue.push(this.list[i]);
				}
			}

			for(var i = 0; i < this.index; i++) {
				theValue.push(this.list[i]);
			}
		}
		return theValue;
	};

	

	/*
		EVENT:
		[login, logout, speak, lsusr, lshis]

		data: {
			user: "",
			date: "",
			message: ""
		}
		
	*/
	var Message = exports.Message = function() {
		this.user="";
		this.date="";
	};

	Message.prototype.login = function(socket, user) {
		data = {
			'user': user,
			'date': new Date().format("yyyy-MM-dd hh:mm:ss")
		}
		socket.emit('login', JSON.stringify(data));
	};


    Message.prototype.onLogin = function(socket, msg, map) {
		data=JSON.parse(msg);
		map.put(data.user, {
			'uid': map.size()+1,
			'conn': socket.id
		});
		socket.join(data.user);
	};

	Message.prototype.onLogout = function(socket, io, map) {
		keySet = map.keySet();
		for (i=0; i<keySet.length; i++) {
			set = map.get(keySet[i]);
			if (set['conn'] == socket.id)
				map.remove(keySet[i])
		}
      	message = new Message();
      	message.onListUser(io, map);
	};

	Message.prototype.speak = function(socket, user, message) {
		data = {
			'user': user,
			'date': new Date().format("yyyy-MM-dd hh:mm:ss"),
			'message': message
		}
		socket.emit('speak', JSON.stringify(data));
	};

	Message.prototype.onSpeak = function(socket, msg, map) {
		data=JSON.parse(msg);
		console.log(map);

		// add into history
		
		message = new Message();
		message.broadcast(socket, msg);
		
		//console.log(data.user);
		//console.log(data.date);
		//console.log(data.message);
	};

	Message.prototype.broadcast = function(socket, msg) {
		socket.broadcast.emit('broadcast', msg);
	};

	Message.prototype.onBroadcast = function(msg) {
		//console.log(msg);
		//console.log("hello");
		data=JSON.parse(msg);
		return data;
	};


	Message.prototype.listUser = function(socket) {
		socket.emit('listUser', '');
	};
	Message.prototype.onListUser = function(socket, map) {
		keySet = map.keySet();
		data = {
			'num': keySet.length,
			'user': keySet
		}
		socket.emit('onListUser', JSON.stringify(data));
	};
	Message.prototype.onListUserComplete = function(msg) {
		data=JSON.parse(msg);
		return data;
	};

	Message.prototype.vedioChat =  function(socket, nickname) {
		socket.emit('join', nickname);
	};
	Message.prototype.onVedioChat = function(socket, io, nickname) {
		var com = require("./common");
		//socket.join(nickname);
		socket.emit('onVedioChatCaller', "http://"+com.VURL+"#"+nickname);
		io.sockets.in(nickname).emit('onVedioChatCallee', "http://"+com.VURL+"#"+nickname);
	};
	Message.prototype.onVedioChatCaller = function(msg) {
		window.location.assign(msg);
	};
	Message.prototype.onVedioChatCallee = function(msg) {
		return msg;
	}

/*
	Message.prototype.lsusr = function() {

	};
	Message.prototype.lshis = function() {

	}
*/	

})((function() {
	if(typeof exports === 'undefined') {
		window.lib_chat = {};
		return window.lib_chat;
	} else {
		return exports;
	}
})());
