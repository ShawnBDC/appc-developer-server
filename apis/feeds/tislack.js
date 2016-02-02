var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/tislack',
	method: 'GET',
	description: 'TiSlack Leaderboard',
	plural: 'slackers',
	singular: 'slacker',
	action: function (req, res, next) {

		// even if it's expired, we won't wait for the new data
		if (cache) {
			res.success(cache, next);
		}

		// time to request (new) data (random to not do all together)
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * utils.getRandom(10, 15)))) {

			request({
				url: 'http://tislack.org/leaderboard_json.php',
				json: true
			}, function (error, response, body) {

				if (!error && body && _.isArray(body) && body.length > 0) {
					var slackers = body.slice(0, 5);

					// first time, so we still have to respond
					if (!cache) {
						res.success(slackers, next);
					}

					cachedAt = Date.now();
					cache = slackers;

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
