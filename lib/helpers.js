var _ = require('lodash');
var moment = require('moment');

var $ = module.exports = {};

$.escape = function (str) {
	return _.escape(str);
};

$.stripTags = function (str) {
	return str.replace(/<[^>]+>/g, '');
};

/*jshint eqeqeq:false */
$.compare = function () {
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

$.contains = function (hay, needle, options) {
	var value;

	if (!hay) {
		value = false;
	} else if (typeof hay === 'string') {
		value = hay.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	} else {
		value = hay.indexOf(needle) !== -1;
	}

	// is called as block
	if (options && options.fn) {

		if (value) {
			return options.fn({
				value: value
			});

		} else {
			return options.inverse(this);
		}

	} else {
		return value;
	}
};

$.all = $.every = function () {
	var args = Array.prototype.slice.call(arguments);
	var options = args.pop();

	// {{#all foo ..}}
	return _.every(args, _.identity) ? options.fn(this) : options.inverse(this);
};

$.any = $.some = function () {
	var args = Array.prototype.slice.call(arguments);
	var options = args.pop();

	// {{#any foo ..}}
	return _.some(args, _.identity) ? options.fn(this) : options.inverse(this);
};

$.ifAfter = function (dateA, dateB, options) {

	// accept unix as string
	if (typeof date === 'string' && /^[0-9]+$/.test(date)) {
		date = parseInt(date, 10);
	}

	return moment(dateA).isAfter(dateB) ? options.fn(this) : options.inverse(this);
};

$.concat = function () {
	var args = Array.prototype.slice.call(arguments, 0, -1);

	return _.reduce(args, function (memo, val) {
		return memo + val;
	});
};

$.reputation = function (reputation) {
	if (reputation > 1000) {
		return Math.round(reputation / 1000).toString() + 'k';
	} else {
		return reputation.toString();
	}
};

$.truncateStringTo = function (str, length) {

	if (str.length > length) {
		return str.substr(0, length) + '...';
	} else {
		return str;
	}
};

$.formatDate = function (date, format) {

	// accept unix as string
	if (typeof date === 'string' && /^[0-9]+$/.test(date)) {
		date = parseInt(date, 10);
	}

	return moment(date).format(format);
};

// updated to equal what GitHub does
$.slug = function (str) {
	return str.toString().toLowerCase().split(/\s+/).map(function (word) {
		return word.replace(/[^a-z0-9]+/g, '');
	}).join('-');
};
