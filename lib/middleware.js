var url = require('url');

var AppC = require('appc-platform-sdk'),
	_ = require('lodash');

var HttpError = require('./HttpError');

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

		if (err) {
			return next();
		}

		// expose user to views and save to session
		// we cannot save all: https://github.com/appcelerator-developer-relations/appc-devlink-server/issues/91
		req.app.locals.user = req.session.user = _.pick(session.user, 'guid', 'firstname', 'lastname', 'email', 'org');

		AppC.Org.findById(session, session.user.org_id, function (err, org) {

			if (!err) {
				req.app.locals.user.entitlements = org.entitlements;
			}

			return next();
		});
	});
};

Middleware.internalServerError = function (err, req, res, next) {
	var server = req.server;
	var app = server.app;

	if (typeof err === 'string') {
		err = {
			status: 500,
			message: err
		};
	}

	if (err.status === 404) {
		req.logger.error('[404] ' + req.originalUrl);
	} else {
		req.logger.error(req.originalUrl + ' Failed With ' + err + ' ' + err.stack);
	}

	if (res.headersSent) {
		return next(err);
	}

	var context = {
		message: err.message || 'Unexpected Server Error'
	};

	if (req.xhr) {
		context.error = context.message;
		context.success = false;

		return res.send(context);
	}

	context.title = 'Error';
	context.code = err.status || 500;

	if (req.server.config.env === 'development') {
		context.error = err.stack;
		context.env = JSON.stringify(req.app.locals, null, 2);
		context.req = JSON.stringify(_.pick(req, '_reqid', 'method', 'path', 'params', 'query', 'body', 'headers', 'cookies'), null, 2);
	}

	req.server.app.render('error', context, function (renderErr, html) {
		res.status(context.code).send(html || renderErr.message, next);
	});
};

Middleware.notFound = function (req, res, next) {

	// make an exception for /arrow, /apidoc and /api
	// which are not routed before this middleware
	if (!res._flushBodyCalled && !isAdmin(req)) {
		next(new HttpError(404, 'Page Not Found'));
		return;
	}

	next();
};

function isAdmin(req) {
	var re = new RegExp('^(' + req.server.config.admin.prefix + '|' + req.server.config.admin.apiDocPrefix + '|' + req.server.config.apiPrefix + ')');
	return re.test(req.originalUrl);
}
