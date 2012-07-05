var mongoose = require('mongoose'),
sio = require('socket.io'),
sioc = require('socket.io-client'),
request = require('request');

module.exports = SystemsController = function(app) {
    var self = this,
    man, io;

    //setup proxied routes
    app.get('/system/status', function(req, res) {
	doRequest('/system/status', req, res);
    });

    app.get('/system/:cmd(start|stop|restart|status|update|backupServer|backupMaps|backupLogs|reloadConfig|isRunning)/:server/:remote?', function(req, res) {
	doRequest('/status', req, res);
    });
    
    app.post('/system/cmd/:server/:remote?', function(req, res) {
	doRequest('/cmd', req, res, 'POST');
    });

    app.get('/system/config/:key', function(req, res) {
	doRequest('/config/' + req.params.key, req, res);
    });

    app.post('/system/config/:key', function(req, res) {
	doRequest('/config/' + req.params.key, req, res);
    });

    app.get('/system/list/:remote?', function(req, res) {
	doRequest('/list', req, res);
    });

    app.post('/:cmd(add|rm)/:type(server|remote)/:remote?', function(req, res) {
	doRequest(req.params.cmd + '/' + req.params.type, req, res, 'POST');
    });

    //setup the socket.io listener
    io = sio.listen(app);

    //subscribe to manager socket.io
    man = sioc.connect('localhost', { port: 9876 });

    //echo manager events
    man.on('output', function(msg) {
	io.sockets.emit('output', msg);
    });

    man.on('player::connect', function(msg) {
	io.sockets.emit('player::connect', msg);
    });

    man.on('player::disconnect', function(msg) {
	io.sockets.emit('player::disconnect', msg);
    });

    man.on('player::chat', function(msg) {
	io.sockets.emit('player::chat', msg);
    });
};

function doRequest(path, req, res, method) {
    var opts = {
	url: buildUrl(path, req),
	method: method || 'GET',
	json: (method == 'POST' ? req.body : undefined)
    };

    console.log(opts);
    request(opts, function(err, response, body) {
	if(!err && response.statusCode == 200) {
	    if(typeof(body) == 'string') {
		try {
		    res.json(JSON.parse(body));
		} catch(e) {
		    res.json({
			success: false,
			error: e.message,
			body: body
		    });
		}
	    }
	    else
		res.json(body);
	} else {
	    res.json({
		success: false,
		error: (err ? err.message : 'Got non 200 status code (' + response.statusCode + ')'),
		url: buildUrl(path, req),
		body: body
	    });
	}
    });
}

function buildUrl(path, req) {
    return 'http://localhost:9876' + path + 
	(req.params.server ? '/' + req.params.server : '') +
	(req.params.remote ? '/' + req.params.remote : '') +
	'?token=e0a39d05-a6b4-4514-bf16-504d99c5ee47';
}