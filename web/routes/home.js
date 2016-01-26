var _ = require('lodash');
var async = require('async');
var Arrow = require('arrow');

var cache;

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/home',
	method: 'GET',
	action: function (req, res, next) {

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
			stackoverflow: function (callback) {
				req.server.getAPI('/api/feeds/stackoverflow').execute(function (err, results) {
					callback(null, results ? results[results.key].slice(0, 5) : null);
				});
			},
			blog: function (callback) {
				req.server.getAPI('/api/feeds/rss').execute({
					url: 'http://www.appcelerator.com/cat/developer/feed/'
				}, function (err, results) {
					callback(null, results ? results[results.key].slice(0, 5) : null);
				});
			},
			gittio: function (callback) {
				req.server.getAPI('/api/feeds/rss').execute({
					url: 'http://gitt.io/rss.xml'
				}, function (err, results) {
					callback(null, results ? results[results.key].slice(0, 5) : null);
				});
			},
			jira: function (callback) {
				req.server.getAPI('/api/feeds/rss').execute({
					url: 'https://jira.appcelerator.org/sr/jira.issueviews:searchrequest-rss/temp/SearchRequest.xml?jqlQuery=project+in+%28AC%2C+TC%29+AND+resolution+%3D+Unresolved+ORDER+BY+created+DESC%2C+updated+ASC%2C+priority+DESC&tempMax=1000'
				}, function (err, results) {
					callback(null, results ? results[results.key].slice(0, 5) : null);
				});
			},
			medium: function (callback) {
				req.server.getAPI('/api/feeds/rss').execute({
					url: 'https://medium.com/feed/all-titanium'
				}, function (err, results) {
					callback(null, results ? results[results.key].slice(0, 5) : null);
				});
			}
		}, function (err, results) {
			res.render('home', results);
			next();
		});
	}
});
