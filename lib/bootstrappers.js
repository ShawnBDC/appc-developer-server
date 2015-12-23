var cookieParser = require('cookie-parser');

var helpers = require('./helpers');

var Bootstrappers = module.exports = {};

Bootstrappers.signedCookies = function(server) {

	// add support for signed cookies
	// since Arrow already defines cookies using it's own middleware and the
	// cookie-parser skips if req.cookies is already defined. we are going to undefine and then switch
	server.app.use(function(req, resp, next) {
		req._cookies = req.cookies;
		// so that cookie parser will run
		delete req.cookies;
		next();
	});
	server.app.use(cookieParser(server.config.session.secret));
	server.app.use(function(req, resp, next) {
		// restore
		req.cookies = req._cookies;
		next();
	});
};

Bootstrappers.handlebars = function(server) {

	// set default layout
	server.app.set('layout', 'layouts/default');

	// add HBS partials
	var handlebars = server.getMiddleware().getRendererEngine('hbs');
	handlebars.registerPartials('./web/views/layouts');
	handlebars.registerPartials('./web/views/partials');

	// register helpers for HBS
	for (var name in helpers) {
		handlebars.registerHelper(name, helpers[name]);
	}
};
