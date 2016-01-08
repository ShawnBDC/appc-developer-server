var Arrow = require('arrow');

module.exports = Arrow.Router.extend({
	name: __filename,
	path: '/',
	method: 'GET',
	action: function (req, res, next) {
    res.redirect(302, '/help');
	}
});
