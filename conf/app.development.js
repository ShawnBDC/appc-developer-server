var fs = require('fs');
var path = require('path');

var $ = module.exports = {
	ssl: {
		key: fs.readFileSync(path.join(__dirname, 'local.key')),
		cert: fs.readFileSync(path.join(__dirname, 'local.crt'))
	},
	baseurl: (process.env.APPC_ENV === 'production' ? 'https://developer-local.appcelerator.com:8443' : 'https://developer-local.cloud.appctest.com:8443'),
};
