var platform = require('platform');

/**
 * get a user agent parsed object and return the object.
 * also set's the req.userAgent variable for subsequent middleware usage
 */
exports.getUserAgent = function (req) {
	if (!req.userAgent) {
		req.userAgent = platform.parse(req.headers['user-agent']);
		req.userAgent.isWindows = req.query.os === 'win' || !req.query.os && req.userAgent.os && /^Windows/i.test(req.userAgent.os.family);
		req.userAgent.isOSX = req.query.os === 'osx' || !req.query.os && req.userAgent.os && /(OS X|iOS)/i.test(req.userAgent.os.family);
		req.userAgent.isLinux = req.query.os === 'linux' || !req.query.os && req.userAgent.os && /(Linux|Ubuntu|Red Hat|SuSE|Fedora|Debian|Android)/i.test(req.userAgent.os.family);
		req.userAgent.isMobile = req.userAgent.os && /(Android|iOS|Phone)/i.test(req.userAgent.os.family);
		req.userAgent.name = req.userAgent.isOSX ? 'osx' : req.userAgent.isWindows ? 'windows' : req.userAgent.isLinux ? 'linux' : 'unknown';
	}
	return req.userAgent;
};
