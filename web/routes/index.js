var _ = require('lodash');
var async = require('async');
var Arrow = require('arrow');
var helpers = require('../../lib/helpers');
var moment = require('moment');
var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/',
	method: 'GET',
	action: function (req, res, next) {
		var rendered = false;

		// res.redirect('/help');
		// return next();

		function render(context) {

			if (!rendered) {
				rendered = true;

				context.scripts = ['/js/crazyColors.js'];

				_.extend(context, req.server.config.app.index);
				res.render('index', context);
			}

			next();
		}

		// even if it's expired, we won't wait for the new data
		if (cache) {
			render(cache);
		}

		// time to request (new) data
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * 15))) {

			async.parallel({

				devblog: function (callback) {
					req.server.getAPI('/api/feeds/rss').execute({
						url: 'http://www.appcelerator.com/cat/developer/feed/'
					}, function (err, results) {
						callback(null, results ? results[results.key].slice(0, 4) : null);
					});
				},

				updates: function (callback) {

					async.parallel([
						function marketplace(nextSource) {
							req.server.getAPI('/api/feeds/marketplace').execute(function (err, results) {
								nextSource(null, results ? {
									title: results[results.key][0].name,
									link: results[results.key][0].url,
									published: results[results.key][0].lastModified,
									author: 'Appcelerator Marketplace'
								} : null);
							});
						},
						function university(nextSource) {
							req.server.getAPI('/api/feeds/university').execute(function (err, results) {
								nextSource(null, results ? {
									title: results[results.key][0].title,
									link: 'http://university.appcelerator.com/video/' + results[results.key][0].id + '/' + helpers.slug(results[results.key][0].title),
									published: results[results.key][0].date,
									author: 'Appcelerator University'
								} : null);
							});
						},
						function samples(nextSource) {
							req.server.getAPI('/api/feeds/samples').execute(function (err, results) {
								nextSource(null, results ? {
									title: results[results.key][0].name,
									link: results[results.key][0].location,
									published: results[results.key][0].created_at,
									author: 'Appcelerator Samples'
								} : null);
							});
						},
						function gittio(nextSource) {
							req.server.getAPI('/api/feeds/rss').execute({
								url: 'http://gitt.io/rss.xml'
							}, function (err, results) {
								nextSource(null, results ? {
									title: results[results.key][0].title,
									link: results[results.key][0].link,
									published: results[results.key][0].published,
									author: 'gitTio'
								} : null);
							});
						},
						function medium(nextSource) {
							req.server.getAPI('/api/feeds/rss').execute({
								url: 'https://medium.com/feed/all-titanium'
							}, function (err, results) {
								nextSource(null, results ? {
									title: results[results.key][0].title,
									link: results[results.key][0].link,
									published: results[results.key][0].published,
									author: 'gitTio'
								} : null);
							});
						}

					], function (err, results) {

						if (results) {
							results = _.sortBy(_.filter(results), function (o) {
								return moment(o.published).valueOf();
							}).reverse().slice(0, 3);
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
