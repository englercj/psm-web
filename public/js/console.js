(function($, win) {
    $(function() {
	var $console = $('#console'),
	$input = $console.find('input');

	//setup command sending
	$input.on('keypress', function(e) {
	    if(e.which == 13) {
		e.preventDefault();
		
		//send command
		api.doCommand($input.val(), 'crafttest', function(err, data) {
		    console.log(err, data);
		});
		$input.val('');
	    }
	});

	//setup output listener
	api.socket.on('output', function(msg) {
	    var $pre = $('#console pre');

	    //add lines to console
	    for(var i = 0, line; line = msg.lines[i]; ++i) {
		$pre.append(util.tagOutput(line) + '\n');
	    }

	    //add notification if not selected
	    if(util.selectedTab() != 'console') {
		util.setNotification('console', util.getNotification('console') + msg.lines.length);
	    }
	});
    });
})(jQuery, window);