var _ = require('lodash');
var async = require('async');
var Arrow = require('arrow');
var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/updates',
	method: 'GET',
	action: function (req, res, next) {
		var rendered = false;

		function render(context) {

			if (!rendered) {
				rendered = true;

				context.activeNav = '/updates';
				context.title = 'Updates';
				context.scripts = ['/js/jquery.matchHeight.js'];

				res.render('updates', context);
			}

			next();
		}

		// even if it's expired, we won't wait for the new data
		if (cache) {
			render(cache);
		}

		// time to request (new) data (random to not do all together)
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * 15))) {

			async.parallel({
				lastVisit: function (callback) {
					if (!req.session.user) {
						return callback();
					}
					var model = req.server.getModel('user');
					model.query({
						where: {
							guid: req.session.user.guid
						}
					}, function (err, results) {
						var lastViewedHome;

						if (!err && results && results.length !== 0) {
							lastViewedHome = results[0].lastViewedHome;
							results[0].set('lastViewedHome', new Date()).save();

						} else {
							lastViewedHome = new Date();

							model.create({
								guid: req.session.user.guid,
								lastViewedHome: lastViewedHome
							});
						}

						callback(null, lastViewedHome);
					});
				},
				so_questions: function (callback) {
					req.server.getAPI('/api/feeds/so_questions').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 4) : null);
					});
				},
				so_users: function (callback) {
					req.server.getAPI('/api/feeds/so_users').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 5) : null);
					});
				},
				marketplace: function (callback) {
					req.server.getAPI('/api/feeds/marketplace').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 3) : null);
					});
				},
				tislack: function (callback) {
					req.server.getAPI('/api/feeds/tislack').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 5) : null);
					});
				},
				university: function (callback) {
					req.server.getAPI('/api/feeds/university').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 3) : null);
					});
				},
				samples: function (callback) {
					req.server.getAPI('/api/feeds/samples').execute(function (err, results) {
						callback(null, results ? results[results.key].slice(0, 3) : null);
					});
				},
				devblog: function (callback) {
					req.server.getAPI('/api/feeds/rss').execute({
						url: 'http://www.appcelerator.com/cat/developer/feed/'
					}, function (err, results) {

						if (results) {
							results = results[results.key].slice(0, 3);
							results[0].image = utils.extractImageSrc(results[0].content);
						}

						callback(null, results);
					});
				},
				gittio: function (callback) {
					req.server.getAPI('/api/feeds/rss').execute({
						url: 'http://gitt.io/rss.xml'
					}, function (err, results) {
						callback(null, results ? results[results.key].slice(0, 3) : null);
					});
				},
				jira: function (callback) {
					req.server.getAPI('/api/feeds/rss').execute({
						url: 'https://jira.appcelerator.org/sr/jira.issueviews:searchrequest-rss/temp/SearchRequest.xml?jqlQuery=project+in+%28AC%29+AND+resolution+%3D+Unresolved+ORDER+BY+created+DESC%2C+updated+ASC%2C+priority+DESC&tempMax=1000'
					}, function (err, results) {
						callback(null, results ? results[results.key].slice(0, 4) : null);
					});
				},
				medium: function (callback) {
					req.server.getAPI('/api/feeds/rss').execute({
						url: 'https://medium.com/feed/all-titanium'
					}, function (err, results) {

						if (results) {
							results = results[results.key].slice(0, 3);
							results[0].image = utils.extractImageSrc(results[0].content);
						}

						callback(null, results);
					});
				}
			}, function (err, results) {

				cachedAt = Date.now();
				cache = results;

				render(results);
			});
		}
	}
});
