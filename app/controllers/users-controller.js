var mongoose = require('mongoose'),
User = mongoose.model('User');

module.exports = UsersController = function(app) {
    //handle logout
    app.get('/logout', function(req, res) {
	res.logout();
	res.redirect('/');
    });
};