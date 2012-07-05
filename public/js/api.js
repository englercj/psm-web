(function($, win) {
    win.api = {
	getSystemStatus: function(cb) {
	    api.doAjax('/system/status', 'GET', cb);
	},
	getServerStatus: function(server, cb) {
	    api.doAjax('/system/' + server + '/status', 'GET', cb);
	},
	doAjax: function(url, method, data, cb) {
	    if(typeof(data) == 'function') { cb = data; data = undefined; }
	    if(typeof(method) == 'function') { cb = method; method = 'GET'; }

	    $.ajax({
		cache: false,
		crossDomain: false,
		data: data,
		dataType: 'json',
		processData: true,
		type: method,
		url: url,
		success: function(data, textStatus, jqXHR) {
		    if(cb) cb(data.error, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		    if(cb) cb(errorThrown || textStatus);
		}
	    });
	}
    };
})(jQuery, window);