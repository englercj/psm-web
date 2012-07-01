var mongoose = require('mongoose'),
request = require('request');

module.exports = SystemsController = function(app) {
    var self = this;

    app.get('/system/status', function(req, res) {
	request('http://localhost:9876/system/status?token=e0a39d05-a6b4-4514-bf16-504d99c5ee47', function(err, response, body) {
	    res.json(JSON.parse(body));
	});
    });
};