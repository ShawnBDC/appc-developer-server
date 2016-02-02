var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

var utils = require('../../lib/utils');

var cache;
var cachedAt;

module.exports = Arrow.API.extend({
	group: 'feeds',
	path: '/api/feeds/university',
	method: 'GET',
	description: 'Newest Appcelerator University Videos',
	plural: 'videos',
	singular: 'video',
	action: function (req, res, next) {

		// even if it's expired, we won't wait for the new data
		if (cache) {
			res.success(cache, next);
		}

		// time to request (new) data (random to not do all together)
		if (!cache || (Date.now() - cachedAt > (1000 * 60 * utils.getRandom(10, 15)))) {

			request({
				url: 'https://university.appcelerator.com/api/video/query?where=' + JSON.stringify({
					'tags': 'published',
					'order_by': 'date:desc',
					'result_limit': 3
				}),
				headers: {
					Authorization: 'Basic VGswNHhoMjdNeGlCTEdWMHU3MlVkUlBDZzNYNHd0WmI6'
				},
				json: true,
				gzip: true
			}, function (error, response, body) {

				if (!error && _.isObject(body) && body.success && body[body.key] && body[body.key].length > 0) {

					var videos = _.map(body[body.key], function(video) {
						video.date = video.date * 1000;
						return video;
					});

					// first time, so we still have to respond
					if (!cache) {
						res.success(videos, next);
					}

					cachedAt = Date.now();
					cache = videos;

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
