var _ = require('lodash');
var botDetect = require('bot-detector');

module.exports = {
	encodeForURI: encodeForURI,
	redirect: redirect
};

function encodeForURI(str) {
	return encodeURIComponent(str).replace(/%20/g, '+');
}

function redirect(req, res, opts) {

	// Redirect bots
	if (botDetect.isBot(req.headers['user-agent'])) {
		res.redirect(301, opts.url);
		return;
	}

	// https://support.google.com/webmasters/answer/139066?hl=nl#6
	res.setHeader('Link', '<' + opts.url + '>; rel="canonical"');

	res.render(opts.template || 'redirect_qa', _.extend({
		layout: 'layouts/redirect'
	}, opts));
}
