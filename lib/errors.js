var express = require('express');

exports.boot = function(app) {
    //Once router has finished and no route matched
    //lets return a NotFound error
    app.use(function(req, res, next) {
	next(new NotFound(req.url));
    });

    //Create the NotFound exception
    function NotFound(path) {
	this.name = 'NotFound';
	if(path) {
	    Error.call(this, 'Cannot find ' + path);
	    this.path = path;
	} else {
	    Error.call(this, 'Not Found');
	}
	Error.captureStackTrace(this, arguments.callee);
    }

    NotFound.prototype.__proto__ = Error.prototype;

    //Setup error handlers
    app.error(function(err, req, res, next) {
	console.log(err.stack);

	if(err instanceof NotFound) {
	    res.render('404', {
		status: 404,
		error: err,
		showStack: app.settings.showStackError,
		title: 'Oops! The page you requested doesn\'t exist.'
	    });
	} else {
	    res.render('500', {
		status: 500,
		error: err,
		showStack: app.settings.showStackError,
		title: 'Oops! Something went wrong!'
	    });
	}
    });
};