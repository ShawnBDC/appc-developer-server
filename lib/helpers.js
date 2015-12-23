var _ = require('lodash');

var Helpers = module.exports = {};

Helpers.escape = function (str) {
	return _.escape(str);
};

/*jshint eqeqeq:false */
Helpers.compare = function () {
	var args = Array.prototype.slice.call(arguments);
	var options = args.pop();

	// {{#compare foo bar}}
	if (args.length === 2) {
		args.splice(1, '===');
	}

	// {{#compare foo ">=" bar}}
	if (args.length === 3) {
		switch (args[1]) {
			case '==':
				return (args[0] == args[2]) ? options.fn(this) : options.inverse(this);
			case '!=':
				return (args[0] != args[2]) ? options.fn(this) : options.inverse(this);
			case '===':
				return (args[0] === args[2]) ? options.fn(this) : options.inverse(this);
			case '!==':
				return (args[0] !== args[2]) ? options.fn(this) : options.inverse(this);
			case '&&':
				return (args[0] && args[2]) ? options.fn(this) : options.inverse(this);
			case '||':
				return (args[0] || args[2]) ? options.fn(this) : options.inverse(this);
			case '<':
				return (args[0] < args[2]) ? options.fn(this) : options.inverse(this);
			case '<=':
				return (args[0] <= args[2]) ? options.fn(this) : options.inverse(this);
			case '>':
				return (args[0] > args[2]) ? options.fn(this) : options.inverse(this);
			case '>=':
				return (args[0] >= args[2]) ? options.fn(this) : options.inverse(this);
		}
	}
};

Helpers.all = Helpers.every = function () {
	var args = Array.prototype.slice.call(arguments);
	var options = args.pop();

	// {{#all foo ..}}
	return _.every(args, _.identity) ? options.fn(this) : options.inverse(this);
};

Helpers.any = Helpers.some = function () {
	var args = Array.prototype.slice.call(arguments);
	var options = args.pop();

	// {{#any foo ..}}
	return _.some(args, _.identity) ? options.fn(this) : options.inverse(this);
};
