var url = require('url');

var AppC = require('appc-platform-sdk'),
	_ = require('lodash');

var Middleware = module.exports = {};

Middleware.forceBaseurl = function (req, res, next) {

	if (req.server.config.baseurl) {

		if (req.server.config.baseurl !== req.protocol + '://' + req.get('Host')) {
			return res.redirect(301, req.server.config.baseurl + req.originalUrl);
		}

		// expose to views
		req.app.locals.baseurl = req.server.config.baseurl;
	}

	next();
};

Middleware.redirects = function (req, res, next) {

	if (req.server.config.app.redirects) {

		var pathname = url.parse(req.originalUrl).pathname.replace(/\/$/, '');

		if (req.server.config.app.redirects[pathname]) {
			return res.redirect(301, req.server.config.app.redirects[pathname]);
		}
	}

	next();
};

Middleware.validatePlatformSession = function (req, res, next) {
	var sid = req.cookies ? req.cookies['connect.sid'] : null;

	if (req.session.sid === sid) {
		req.log.debug('[SSO] SID unchanged: ' + req.session.sid);

		// expose cached user to views (if logged in)
		req.app.locals.user = req.session.user;

		return next();
	}

	// reset cache
	req.session.sid = null;
	req.session.user = null;

	if (!sid) {
		req.log.debug('[SSO] No platform SID');

		return next();
	}

	req.log.debug('[SSO] Validating platform SID: ' + sid);

	AppC.Auth.createSessionFromID(sid, function (err, session) {
		req.log.debug('[SSO] Validated platform SID as: ' + (err ? 'logged out' : session.user.email));

		// valid or not, we won't validate this SID again
		req.session.sid = sid;

		if (!err) {

			// expose user to views and save to session
			// we cannot save all: https://github.com/appcelerator-developer-relations/appc-devlink-server/issues/91
			req.app.locals.user = req.session.user = _.pick(session.user, 'guid', 'firstname', 'lastname', 'email', 'org');
		}

		return next();
	});

};

Middleware.internalServerError = function (err, req, res, next) {
	var server = req.server;
	var app = server.app;

	req.logger.error(req.originalUrl + ' Failed With ' + err + ' ' + err.stack);

	if (res.headersSent) {
		return next(err);
	}

	var context = {
		message: err.message || 'Unexpected Server Error'
	};

	if (req.xhr) {
		return res.send(context);
	}

	context.title = 'Error';

	if (req.server.config.env === 'development') {
		var highlight = require('highlight.js');

		context.error = err.stack;
		context.env = highlight.highlight('json', JSON.stringify(req.app.locals, null, 2)).value;
		context.req = highlight.highlight('json', JSON.stringify(_.pick(req, '_reqid', 'method', 'path', 'params', 'query', 'body', 'headers', 'cookies'), null, 2)).value;
		context.stylesheets = [
			'/css/highlight.css'
		];
	}

	req.server.app.render('error', context, function (renderErr, html) {
		res.status(err.status || 500).send(html || renderErr.message, next);
	});
};
