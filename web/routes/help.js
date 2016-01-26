var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/help',
	method: 'GET',
	action: function (req, res, next) {

		var supportMode = (req.session.user && req.session.user.org && req.session.user.org.package) ? (_.contains(['team', 'enterprise'], req.session.user.org.package) ? 'official' : 'community') : 'unknown';

		if (req.session.user && req.query.supportMode) {
			supportMode = req.query.supportMode;
		}

		req.server.getAPI('/api/feeds/so_questions').execute(function (err, results) {

			res.render('help', {
				title: 'Get Help',
				recentQuestions: results[results.key],
				supportMode: supportMode
			});

			next();

		});
	}
});
