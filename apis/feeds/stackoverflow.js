var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var cache;
var cachedAt;
var ttl = 1000 * 60 * 10;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/stackoverflow',
	method: 'GET',
	description: 'Newest Appcelerator Stack Overflow Questions',
	plural: 'questions',
	singular: 'question',
	action: function (req, res, next) {

		// even if it's expired, we won't wait for the new data
		if (cache) {
			res.success(cache, next);
		}

		// time to request (new) data
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * 15))) {

			request({
				url: 'https://api.stackexchange.com/2.2/questions/unanswered?order=desc&sort=creation&pagesize=10&tagged=appcelerator&filter=default&site=stackoverflow',
				json: true,
				gzip: true
			}, function (error, response, body) {

				if (!error && _.isObject(body) && body.items && body.items.length > 0) {

					// first time, so we still have to respond
					if (!cache) {
						res.success(body.items, next);
					}

					cachedAt = Date.now();
					cache = body.items;

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
