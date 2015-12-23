var Arrow = require('arrow');

// export the server so we can use it elsewhere
var server = module.exports = new Arrow();

var bootstrap = require('./lib/bootstrap');

bootstrap.beforeRouter && bootstrap.beforeRouter(server);

// lifecycle examples
server.on('starting', function () {
	server.logger.debug('server is starting!');

	bootstrap.afterRouter && bootstrap.afterRouter(server);
});

server.on('started', function () {
	server.logger.debug('server started!');

	bootstrap.afterAll && bootstrap.afterAll(server);
});

// start the server
server.start();
