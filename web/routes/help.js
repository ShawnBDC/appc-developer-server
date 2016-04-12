var _ = require('lodash');
var Arrow = require('arrow');
var request = require('request');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/help',
	method: 'GET',
	action: function (req, res, next) {
		var paidSupport = (req.session.user && req.session.user.entitlements && req.session.user.entitlements.paidSupport);
		var supportLink = (req.session.user && req.session.user.entitlements && req.session.user.entitlements.supportLink) || (paidSupport ? 'http://support2.appcelerator.com' : 'https://developer.appcelerator.com/help');

		req.server.getAPI('/api/feeds/so_questions').execute(function (err, results) {

			res.render('help', {
				activeNav: '/help',
				title: 'Help',
				recentQuestions: results[results.key].slice(0, 10),
				paidSupport: paidSupport,
				supportLink: supportLink
			});

			next();

		});
	}
});
