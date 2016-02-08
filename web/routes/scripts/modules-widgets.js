var _ = require('lodash');
var async = require('async');
var Arrow = require('arrow');
var helpers = require('../../../lib/helpers');
var request = require('request');
var utils = require('../../../lib/utils');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/scripts/modules-widgets',
	method: 'GET',
	action: function (req, res, next) {

		if (!req.session.user || req.session.user.email.indexOf('@appcelerator.com') === -1) {
			return this.unauthorized(next);
		}

		var from;

		if (req.query.from) {
			from = (new Date(req.query.from)).getTime();
		}

		if (!from) {
			from = Date.now() - (60 * 60 * 24 * 7 * 1000);
		}

		async.parallel({
			marketplace: function (done) {

				request({
					url: 'https://marketplace.appcelerator.com/api/marketplace/v1/listing?start=500',
					json: true
				}, function (error, response, body) {

					if (error) {
						return done(error);
					}

					var items = [];

					body.forEach(function (product) {
						var item = {};

						if (product.publishedOn > from) {
							item.event = 'new';
						} else if (product.lastModified > from) {
							item.event = 'updated';
						} else {
							return;
						}

						item.url = product.url;
						item.title = product.name;
						item.description = helpers.escape(utils.stripTags(product.overview));
						item.price = product.startingPrice;

						item.type = product.productType.toLowerCase().replace('_', ' ');

						if (_.find(item.tags, function (tag) {
								return (tag.name === 'Alloy');
							})) {
							item.type = 'widget';
						}

						if (item.type === 'open source') {
							item.image = 'http://gitt.io/assets/img/icon_github.png';
						} else if (['module', 'widget'].indexOf(item.type) !== -1) {
							item.image = 'http://gitt.io/assets/img/icon_' + item.type + '.png';
						}

						items.push(item);
					});

					return done(null, items);
				});
			},

			gittio: function (done) {

				request({
					url: 'http://gitt.io/json?from=' + Math.round(from / 1000),
					json: true
				}, function (error, response, body) {

					if (error) {
						return done(error);
					}

					var items = body.map(function (cmp) {

						var item = {
							url: 'http://gitt.io/component/' + cmp.uid,
							title: cmp.title,
							version: cmp.version,
							type: cmp.type,
							event: cmp.event,
							image: 'http://gitt.io/assets/img/icon_' + cmp.type + '.png'
						};

						if (cmp.description !== cmp.title && cmp.description !== cmp.uid) {
							item.description = cmp.description;
						}

						return item;
					});

					return done(null, items);
				});
			}

		}, function (err, results) {

			if (err) {
				return next(err);
			}

			var tags = ['twmw', 'modules', 'widgets', 'alloy', 'titanium'];

			if (results.marketplace.length > 0) {
				tags.push('marketplace');
			}

			if (results.gittio.length > 0) {
				tags.push('gittio');
			}

			res.render('scripts/modules-widgets', {
				title: "This Week's Modules & Widgets",
				from: (new Date(from)).toString(),
				to: (new Date()).toString(),
				marketplace: results.marketplace,
				gittio: results.gittio,
				tags: tags.join(', ')
			});

			next();
		});
	}
});
