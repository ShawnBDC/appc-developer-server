var path = require('path');

var bootstrappers = require('./bootstrappers'),
	middleware = require('./middleware');

var Bootstrap = module.exports = {};

Bootstrap.beforeRouter = function (server) {

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

Bootstrap.afterRouter = function (server) {
	// server.app.use(middleware.notFound);
};

Bootstrap.afterAll = function (server) {
	server.app.use(middleware.internalServerError);
};
