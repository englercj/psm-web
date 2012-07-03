$(function() {
    //Menu ui stuff
    $('a.dash').addClass('selected');
    $('#nav a').on('click', function(e) {
	$('#nav a').removeClass('selected');
	$(this).addClass('selected');
    });

    //load status of PSM box
    $.getJSON('/system/status', function(data, textStatus, jqXHR) {
	console.log(data, textStatus, jqXHR);
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
	    console.log(cpu, mem);
	    $('#performance .cpu .meter').cprogress({
		img1: '/img/progress_bg2.png', img2: '/img/progress_fg2.png',
		speed: 25, PIStep: cpu / 10, limit: Math.round(cpu * 100), loop: false
	    });
	    $('#performance .mem .meter').cprogress({
		img1: '/img/progress_bg2.png', img2: '/img/progress_fg2.png',
		speed: 25, PIStep: mem / 10, limit: Math.round(mem * 100), loop: false
	    });
	} else {
	    
	}
    });
});