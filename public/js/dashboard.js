(function($, win) {
    $(function() {
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
                    util.createProgressbar(stat.$meter, stat.val, stat.max, stat.fmt, stat.divisor);
                });
            });
        });
    });
})(jQuery, window);