(function($) {
    $(function() {
        //Menu ui stuff
        $('a.dash').addClass('selected');
        $('#nav a').on('click', function(e) {
            $('#nav a').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#performance .loader').show();

        //load status of PSM box
        api.getSystemStatus(function(err, data) {
            if(err) return;

            api.getServerStatus('crafttest', function(err, server) {
                if(err) return;

                var totalCpuTime = 0,
                idleCpuTime = 0;

                //hide the loader
                $('#performance .loader').hide();

		//server title
                $('#performance h2').show().text(server.data.properties['server-name']);

                //add host type
                $('#performance').append('<h6><b>Minecraft Version:</b> v' + server.data.mcversion + '</h6>');
		$('#performance').append('<h6><b>Craftbukkit Build:</b> ' + server.data.cbversion + '</h6>');

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
                        title: 'Players Connected',
                        name: 'players',
                        val: 16,
                        max: data.status.maxPlayers || 32,
                        fmt: '{v} / {m}',
                        divisor: 1
                    },
                    {
                        title: 'CPU Usage',
                        name: 'cpu',
                        val: totalCpuTime - idleCpuTime,
                        max: totalCpuTime,
                        fmt: '{p}%',
                        divisor: 1
                    },
                    {
                        title: 'RAM Usage',
                        name: 'ram',
                        val: data.status.totalmem - data.status.freemem,
                        max: data.status.totalmem,
                        fmt: '{v} / {m} MB',
                        divisor: 1048576
                    }
                ];

                //create each stat graph
                stats.forEach(function(stat) {
                    var $div = $('<div/>').addClass(stat.name),
                    $title = $('<h5/>').text(stat.title).appendTo($div),
                    $meter = $('<div/>').addClass('meter').appendTo($div),
                    $val = $('<span/>').appendTo($meter);

                    $('#performance').append($div);
                    createProgressbar($meter, stat.val, stat.max, stat.fmt, stat.divisor);
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

            $elm.animate(
                {
                    'data-value': val
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
    });
})(jQuery);