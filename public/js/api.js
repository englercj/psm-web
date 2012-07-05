(function($, win) {
    win.api = {
	init: function() {
	    api.socket = io.connect('/');
	},
	getSystemStatus: function(cb) {
	    util.doAjax('/system/status', 'GET', cb);
	},
	getServerStatus: function(server, cb) {
	    util.doAjax('/system/status/' + server, 'GET', cb);
	},
	socket: null
    };
})(jQuery, window);