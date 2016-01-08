var path = require('path');

var bootstrappers = require('./bootstrappers'),
	middleware = require('./middleware');

var Bootstrap = module.exports = {};

Bootstrap.init = function (server) {

	if (server.config.baseurl) {
		server.app.use(middleware.forceBaseurl);
	}

	if (server.config.app.redirects) {
		server.app.use(middleware.redirects);
	}

	bootstrappers.signedCookies(server);

	server.app.use(middleware.validatePlatformSession);

	// expose package variables to views
	server.app.locals.pkg = require('../package.json');

	bootstrappers.handlebars(server);
};

Bootstrap.starting = function (server) {};

Bootstrap.started = function (server) {
	server.app.use(middleware.notFound);
	server.app.use(middleware.internalServerError);
};
