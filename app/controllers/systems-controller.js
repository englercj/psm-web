var mongoose = require('mongoose'),
sio = require('socket.io'),
sioc = require('socket.io-client'),
request = require('request');

module.exports = SystemsController = function(app) {
    var self = this,
    man, io;

    //setup routes
    app.get('/system/status', function(req, res) {
	request(buildUrl('/system/status'), function(err, response, body) {
	    res.json(JSON.parse(body));
	});
    });

    app.get('/system/:cmd(start|stop|restart|status)/:server', function(req, res) {
	request('http://localhost:9876/status/' + req.params.server + '?token=e0a39d05-a6b4-4514-bf16-504d99c5ee47', function(err, response, body) {
	    res.json(JSON.parse(body));
	});
    });

    app.get('/system/config/:key', function(req, res) {
	request();
    });

    //setup the socket.io listener
    io = sio.listen(app);

    //subscribe to manager socket.io
    man = sioc.connect('localhost', { port: 9876 });

    man.on('output', function(msg) {
	console.log('got output', msg);
	io.sockets.emit('output', msg);
    });

    man.on('player::connect', function(msg) {
	console.log('got player::connect', msg);
	io.sockets.emit('player::connect', msg);
    });

    man.on('player::disconnect', function(msg) {
	console.log('got player::disconnect', msg);
	io.sockets.emit('player::disconnect', msg);
    });

    man.on('player::chat', function(msg) {
	console.log('got player::chat', msg);
	io.sockets.emit('player::chat', msg);
    });
};

function buildUrl(path) {
    return 'http://localhost:9876' + path + '?token=e0a39d05-a6b4-4514-bf16-504d99c5ee47';
}