//Load required modules
var express = require('express'),
fs = require('fs'),
path = require('path'),
yaml = require('js-yaml'),
mongoose = require('mongoose'),
mongooseAuth = require('mongoose-auth'),
everyauth = require('everyauth'),
utils = require('./lib/utils'),
auth = require('./lib/auth');

//Load configuration
var config = require(path.join(__dirname, 'config', 'psm.yml')).shift();

//Connect to MongoDB
mongoose.connect(config.db.uri);

//Load Models
var mDir = path.join(__dirname, 'app', 'models'),
mFiles = fs.readdirSync(mDir),
User;

mFiles.forEach(function(file) {
    require(path.join(mDir, file));
});

User = mongoose.model('User');

//Initialize express app
var app = express.createServer();
require('./lib/configure').boot(app, config);

app.get('/', function(req, res) {
    res.render('home', { title: 'Panther Server Manager' });
});

//Load Controllers
var cDir = path.join(__dirname, 'app', 'controllers'),
cFiles = fs.readdirSync(cDir);

cFiles.forEach(function(file) {
    require(path.join(cDir, file))(app);
});

//Load Error handlers
require('./lib/errors').boot(app);

//Initialize Mongoose Auth
mongooseAuth.helpExpress(app);
everyauth.helpExpress(app, { userAlias: 'current_user' });

//Start express server
app.listen(config.port, config.host);