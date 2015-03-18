(function(exports) {
	exports.PORT = 8008;
	exports.HOST = "192.155.85.76";
	exports.VURL = exports.HOST+":2013";
})((function() {
	if(typeof exports === 'undefined') {
		window.common = {};
		return window.common;
	} else {
		return exports;
	}
})());