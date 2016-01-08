var Arrow = require('arrow');

// export the server so we can use it elsewhere
var server = module.exports = new Arrow();

var bootstrap = require('./lib/bootstrap');

bootstrap.init(server);

// lifecycle examples
server.on('starting', function () {
	server.logger.debug('server is starting!');

	bootstrap.starting(server);
});

server.on('started', function () {
	server.logger.debug('server started!');

	bootstrap.started(server);
});

// start the server
server.start();
