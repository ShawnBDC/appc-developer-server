var Arrow = require('arrow'),
	LRUCache = require('lru-cache'),
	AppC = require('appc-platform-sdk'),
	async = require('async'),
	request = require('request'),
	UA = require('../../../lib/useragent'),

	nodeJSCache = new LRUCache({
		maxAge: 86400000 // 1 day
	}),
	appcCache = new LRUCache({
		maxAge: 3600000 // 1 hour
	});

/**
 * getLatestAppc
 */
function getLatestAppc (callback) {
	var latest = appcCache.get('appc');
	if (latest) {
		return callback(null, latest);
	}
	// jscs:disable jsDoc
	request(AppC.registryurl + '/api/appc/list', function (err, resp, body) {
		if (err) { return callback(err); }
		try {
			body = JSON.parse(body);
			var latest = body[body.key][0].version;
			appcCache.set('appc', latest);
			return callback(null, latest);
		} catch (E) {
			return callback(E);
		}
	});
}

/**
 * makeDownload
 */
function makeDownload(line) {
	var i = line.indexOf(' '),
		sha = line.substring(0, i).trim(),
		fn = line.substring(i + 1).trim(),
		version = /v(\d+\.\d+\.\d+)/.exec(fn)[1];
	return {
		sha: sha,
		shaurl: 'https://nodejs.org/dist/v' + version + '/SHASUMS.txt.asc',
		version: version,
		url: 'https://nodejs.org/dist/v0.10.37/' + fn,
		license: 'https://raw.githubusercontent.com/joyent/node/v' + version + '/LICENSE'
	};
}

/**
 * fetchNodeJSVersion
 */
function fetchNodeJSVersion(userAgent, callback) {
	var os = userAgent.name;
	var entry = nodeJSCache.get(os);
	if (entry) {
		// return from the cache
		return callback(null, entry);
	}
	request('http://nodejs.org/dist/v0.10.37/SHASUMS.txt', function (err, resp, body) {
		if (err) { return callback(err); }
		var lines = body.split(/\n/),
			results = {};
		// jshint sub:true
		for (var c = 0; c < lines.length; c++) {
			var line = lines[c];
			if (userAgent.isOSX && /\.pkg$/.test(line)) {
				results['universal'] = makeDownload(line);
				break;
			} else if (userAgent.isWindows && /\.msi$/.test(line)) {
				if (/x64/.test(line)) {
					results['x64'] = makeDownload(line);
				} else {
					results['x86'] = makeDownload(line);
				}
			} else if (userAgent.isLinux && /linux/.test(line)) {
				if (/x64/.test(line)) {
					results['x64'] = makeDownload(line);
				} else {
					results['x86'] = makeDownload(line);
				}
			}
		}
		results.any = results[Object.keys(results)[0]];
		// add to the cache
		nodeJSCache.set(os, results);
		callback(null, results);
	});
}

module.exports = Arrow.Router.extend({
	name: 'cli',
	path: '/start/cli',
	method: 'GET',
	description: 'CLI info page',
	action: function (req, res, next) {

		var data = {
			userAgent: UA.getUserAgent(req),
			menuName: 'Dashboard',
			// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			menuLink: req.app.locals.appc_platform_url,
			title: 'Appcelerator CLI',
			stylesheets: [req.server.app.locals.baseurl + '/css/style.css']
		};

		async.parallel([

			// jscs:disable jsDoc
			function (cb) {
				fetchNodeJSVersion(req.userAgent, function (err, result) {
					if (err) { return cb(err); }
					data.nodejs = result;
					cb();
				});
			},

			// jscs:disable jsDoc
			function (cb) {
				getLatestAppc(function (err, result) {
					if (err) { return cb(err); }
					data.appc = result;
					cb();
				});
			}

			// jscs:disable jsDoc
		], function (err) {
			if (err) {
				return next(err);
			}
			res.render('start/cli', data, next);
		});
	}
});
