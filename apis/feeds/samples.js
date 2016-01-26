var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/samples',
	method: 'GET',
	description: 'Newest Sample Apps',
	plural: 'samples',
	singular: 'sample',
	action: function (req, res, next) {

		// even if it's expired, we won't wait for the new data
		if (cache) {
			res.success(cache, next);
		}

		// time to request (new) data (random to not do all together)
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * utils.getRandom(10, 15)))) {

			request({
				url: 'https://appc-studio.appcelerator.com/api/studio_sample_app',
				auth: {
					user: 'NWfNh57WwowynSoEodT34qS5sULbe42h'
				},
				json: true,
				gzip: true
			}, function (error, response, body) {

				if (!error && _.isObject(body) && body.success && body[body.key] && body[body.key].length > 0) {

					var samples = _.map(body[body.key], function(sample) {
						if (sample.image.indexOf('://') === -1) {
							sample.image = 'https://appc-studio.appcelerator.com/' + sample.image;
						}
						return sample;
					});

					// first time, so we still have to respond
					if (!cache) {
						res.success(samples, next);
					}

					cachedAt = Date.now();
					cache = samples;

				} else {

					// first time, so we still have to respond
					if (!cache) {
						res.error(error || 'Failed to fetch data', next);
					}
				}
			});
		}
	}
});
