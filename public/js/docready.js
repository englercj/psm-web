(function($) {
    $(function() {
        //init api
        api.init();

	//init util
	util.init();

	//Setup page tabs
	$('#main').tabs({
	    select: function(e, ui) {
		util.removeNotification(ui.tab.hash.substr(1));
	    }
	});

	//setup ui buttons
	$('button,a.button').button();

        //Menu ui stuff
        $('a.dash').addClass('selected');
        $('#nav a').on('click', function(e) {
            $('#nav a').removeClass('selected');
            $(this).addClass('selected');
        });

        //setup psm status box
        setupPsmStatusBox();
    });
})(jQuery);