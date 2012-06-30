var mongoose = require('mongoose'),
mongooseAuth = require('mongoose-auth'),
UserSchema = new mongoose.Schema({}),
User;

UserSchema.plugin(mongooseAuth, {
    everymodule: {
	everyauth: {
	    User: function() {
		return User;
	    }
	}
    },
    password: {
	everyauth: {
	    getLoginPath: '/login',
	    postLoginPath: '/login',
	    loginView: 'users/login.jade',
	    getRegisterPath: '/register',
	    postRegisterPath: '/register',
	    registerView: 'users/register.jade',
	    loginSuccessRedirect: '/',
	    registerSuccessRedirect: '/'
	}
    }
});

exports = mongoose.model('User', UserSchema);