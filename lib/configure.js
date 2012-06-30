var express = require('express'),
mongoStore = require('connect-mongodb'),
mongooseAuth = require('mongoose-auth'),
path = require('path'),
url = require('url');
//stylus = require('stylus');

exports.boot = function(app, config) {
    app.configure(function() {
	//setup views and template engine
	app.set('views', path.join(__dirname, '..', 'app', 'views'));
	app.set('view engine', 'jade');
	app.set('view options', { layout: 'layouts/default' });

	//includes blocks of content only on required pages
	app.use(function(req, res, next) {
	    //expose path as view variable
	    res.local('path', url.parse(req.url).pathname);

	    //assign content str for section
	    res.local('contentFor', function(section, str) {
		res.local(section, str);
	    });

	    //check is section is defined and return accordingly
	    res.local('content', function(section) {
		if(typeof(res.local(section)) != 'undefined')
		    return res.local(section);
		else
		    return '';
	    });

	    next();
	});

	//add bodyParser and methodOverride
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	//add cookieParser and session
	app.use(express.cookieParser());
	app.use(express.session({
	    secret: config.cookieSecret,
	    store: new mongoStore({
		url: config.db.uri,
		collection: 'sessions'
	    })
	}));

	//setup logging and favicon
	app.use(express.logger(':method :url :status'));
	app.use(express.favicon());

	//include mongooseAuth middleware
	app.use(mongooseAuth.middleware());
    });

    //view helper functions
    app.dynamicHelpers({
	request: function(req) { return req; },
	hasMessages: function(req) {
	    if(!req.session) return false;
	    
	    return Object.keys(req.session.flash || {}).length;
	},
	messages: require('express-messages'),
	dateformat: function(req, res) {
	    return require('dateformat');
	},
	base: function() {
	    return '/' == app.route ? '' : app.route;
	},
	appName: function(req, res) {
	    return 'Panther Server Manager';
	},
	slogan: function(req, res) {
	    return 'Alpha';
	}
    });

    //Add stylus for CSS templating
    /*
    function compile(str, path) {
	return stylus(str)
	    .set('filename', path)
	    .set('warn', true)
	    .set('compress', true)
	    .define('url', stylus.url({ paths: [path.join(__dirname, 'public', 'img')] }));
    }

    //add stylus middleware
    app.use(stylus.middleware({
	debug: true,
	src: path.join(__dirname, 'app', 'stylus'),
	dest: path.join(__dirname, 'public'),
	compile: compile
    }));
    */

    //turn off express error handling
    app.set('showStackError', false);

    //configure environments
    app.configure('development', function() {
	app.set('showStackError', true);
	app.use(express.static(path.join(__dirname, '..', 'public')));
    });

    app.configure('staging', function() {
	app.use(gzippo.staticGzip(path.join(__dirname, '..', 'public')));
	app.enable('view cache');
    });

    app.configure('production', function() {
        app.use(gzippo.staticGzip(path.join(__dirname, '..', 'public')));
        app.enable('view cache');
    });
};