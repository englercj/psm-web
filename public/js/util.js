(function($, win) {
    //global util functions
    win.util = {
	init: function() {},
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
	selectedTab: function() {
	    var sel = $('#main').tabs('option', 'selected'),
            $a = $('#main > .ui-tabs-nav > li').eq(sel).find('a');

	    return $a.attr('href').substr(1);
	},
	setNotification: function(tab, val) {
	    var $a = $('#main > .ui-tabs-nav > li > a[href="#' + tab + '"]'),
	    $n = $a.find('span.notification');

	    if($n.length)
		$n.text(val);
	    else
		$a.append('<span class="notification">' + val + '</span>');
	},
	getNotification: function(tab) {
	    var $a = $('#main > .ui-tabs-nav > li > a[href="#' + tab + '"]'),
            $n = $a.find('span.notification');

	    return ($.isNumeric($n.text()) ? parseInt($n.text(), 10) : $n.text());
	},
	removeNotification: function(tab) {
	    var $a = $('#main > .ui-tabs-nav > li > a[href="#' + tab + '"]'),
            $n = $a.find('span.notification');

	    $n.remove();
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
	},
	createProgressbar: function($elm, val, max, format, divisor) {
            var $span = $elm.find('span');

            divisor = divisor || 1;
	    
            $elm.progressbar({
		change: function(event, ui) {
                    var step = $(event.target).progressbar('option', 'value'),
                    fval = (max * (step / 100)) / divisor,
                    fmax = max / divisor,
                    txt = format.replace('{v}', fval.toFixed())
			.replace('{m}', fmax.toFixed())
			.replace('{p}', step.toFixed());
		    
                    $span.text(txt);
		    
                    if(step >= 50)
			$span.addClass('invert');
                    else
			$span.removeClass('invert');
		}
            });
	    
	    //animates from 0 (no data) to val (set data)
	    //basically provides the calculations for step so we
	    //can do the animation via setting the value option
	    //of the progressbar
            $elm.animate(
		{
                    'data-psm-value': val
		},
		{
                    duration: 2000,
                    easing: 'easeOutCubic',
                    step: function(step) {
			$elm.progressbar('option', 'value', step / max * 100);
                    }
		}
            );
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
	