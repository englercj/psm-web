(function($, win) {
    //global util functions
    win.util = {
	tagOutput: function(str) {
	    str = util.tagStr(str, /([0-9\-: ]+)/, 'timestamp');
	    str = util.tagStr(str, /(\[INFO\])/, 'info');
	    str = util.tagStr(str, /(\[WARN(ING)?\])/, 'warn');
	    str = util.tagStr(str, /(\[SEVERE\])/, 'severe');
	    str = util.tagStr(str, /(\[FATAL\])/, 'fatal');
	    
	    return str;
	},
	tagStr: function(str, regex, clss) {
	    return str.replace(regex, '<span class="' + clss + '">$1</span>');
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

    //some quick jquery funcs
    $.fn.visible = function() {
	return this.css('visibility', 'visible');
    }

    $.fn.invisible = function() {
	return this.css('visibility', 'hidden');
    }
})(jQuery, window);
	