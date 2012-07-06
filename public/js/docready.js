(function($) {
    $(function() {
        //init api
        api.init();

        //Menu ui stuff
        $('a.dash').addClass('selected');
        $('#nav a').on('click', function(e) {
            $('#nav a').removeClass('selected');
            $(this).addClass('selected');
        });

	//Setup dashboard tabs
	$('#main').tabs();

        //show loader on performance
        //$('#performance .loader').show();

	//setup ui buttons
	$('button,a.button').button();

        //setup listeners for socket
        setupSocketListeners();

        //setup psm status box
        setupPsmStatusBox();

	//setup console control
	setupConsole();

	$('a.button').eq(1).button('disable');
    });

    function setupConsole() {
	var $input = $('#console input');

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
    }

    function setupSocketListeners() {
	api.socket.on('output', function(msg) {
	    var $pre = $('#console pre');

	    //add lines to console
	    for(var i = 0, line; line = msg.lines[i]; ++i) {
		$pre.append(util.tagOutput(line) + '\n');
	    }

	    //add notification if not selected
	    var sel = $('#main').tabs('option', 'selected'),
	    $a = $('#main > .ui-tabs-nav > li').eq(sel).find('a');

	    if($a.attr('href') != '#console') {
		$a = $('#main > .ui-tabs-nav > li > a[href="#console"]');

		var $n = $a.find('span.notification');

		//if we already have one, increment number
		if($n.length) {
		    var num = parseInt($n.text(), 10) + msg.lines.length;

		    $n.text(num);
		}
		//otherwise create it
		else {
		    $a.append('<span class="notification">' + msg.lines.length + '</span>');
		}
	    }
	});

	api.socket.on('player::chat', function(chat) {
	    console.log('CHAT:', chat);
	});
    }


    function setupPsmStatusBox() {
        //load status of PSM box
        api.getSystemStatus(function(err, data) {
            if(err) return;

            api.getServerStatus('crafttest', function(err, server) {
                if(err) return;

                var $info = $('#dashboard ul li.info'),
		$players = $('#dashboard ul li.players'),
		$system = $('#dashboard ul li.system'),
		$ctrl = $('#dashboard ul li.control'),
		totalCpuTime = 0,
                idleCpuTime = 0;

                //hide the loader
                //$('#performance .loader').hide();
		//$('#performance ul').show();

                //server title
                $('h2', $info).text(server.data.properties['server-name']);

                //add host type
                $('h6.mcversion', $info).append(' v' + server.data.mcversion);
                $('h6.cbversion', $info).append(' ' + server.data.cbversion);

                //aggregate the status of the system
                for(var i = 0, len = data.status.cpus.length; i < len; ++i) {
                    totalCpuTime += data.status.cpus[i].times.idle;
                    totalCpuTime += data.status.cpus[i].times.irq;
                    totalCpuTime += data.status.cpus[i].times.nice;
                    totalCpuTime += data.status.cpus[i].times.sys;
                    totalCpuTime += data.status.cpus[i].times.user;

                    idleCpuTime += data.status.cpus[i].times.idle;
                }

                var stats = [
                    {
                        val: 16,
                        max: data.status.maxPlayers || 32,
                        fmt: '{v} / {m}',
                        divisor: 1,
			$meter: $('.players .meter', $players)
                    },
                    {
                        val: totalCpuTime - idleCpuTime,
                        max: totalCpuTime,
                        fmt: '{p}%',
                        divisor: 1,
			$meter: $('.cpu .meter', $system)
                    },
                    {
                        val: data.status.totalmem - data.status.freemem,
                        max: data.status.totalmem,
                        fmt: '{v} / {m} MB',
                        divisor: 1048576,
			$meter: $('.ram .meter', $system)
                    }
                ];

                //create each stat graph
                stats.forEach(function(stat) {
                    createProgressbar(stat.$meter, stat.val, stat.max, stat.fmt, stat.divisor);
                });

                /*
                  $('#performance .cpu .meter').cprogress({
                  fg: '/img/progress_fg.png', bg: '/img/progress_bg.png',
                  value: Math.round(cpu * 100)
                  });
                  $('#performance .mem .meter').cprogress({
                  fg: '/img/progress_fg.png', bg: '/img/progress_bg.png',
                  value: Math.round(mem * 100)
                  });
                */
            });
        });
    }

    function createProgressbar($elm, val, max, format, divisor) {
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
})(jQuery);