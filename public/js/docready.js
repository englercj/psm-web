$(function() {
    //Menu ui stuff
    $('a.dash').addClass('selected');
    $('#nav a').on('click', function(e) {
	$('#nav a').removeClass('selected');
	$(this).addClass('selected');
    });

    //load status of PSM box
    $.getJSON('/system/status', function(data, textStatus, jqXHR) {
	if(data.success) {
	    var totalCpuTime = 0,
	    idleCpuTime = 0;

	    for(var i = 0, len = data.status.cpus.length; i < len; ++i) {
		totalCpuTime += data.status.cpus[i].times.idle;
		totalCpuTime += data.status.cpus[i].times.irq;
		totalCpuTime += data.status.cpus[i].times.nice;
		totalCpuTime += data.status.cpus[i].times.sys;
		totalCpuTime += data.status.cpus[i].times.user;

		idleCpuTime += data.status.cpus[i].times.idle;
	    }

	    var cpu = 1 - (idleCpuTime / totalCpuTime),
	    mem = 1 - (data.status.freemem / data.status.totalmem);

	    $('#performance .cpu .meter').cprogress({
		fg: '/img/progress_fg.png', bg: '/img/progress_bg.png',
		value: Math.round(cpu * 100)
	    });
	    $('#performance .mem .meter').cprogress({
		fg: '/img/progress_fg.png', bg: '/img/progress_bg.png',
		value: Math.round(mem * 100)
	    });
	} else {
	    
	}
    });
});