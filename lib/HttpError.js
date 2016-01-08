function HttpError(status, message) {
	this.status = status || 500;
	this.name = 'HttpError';
	this.message = message || 'Unknown Error';
	this.stack = (new Error()).stack;
}

HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;
