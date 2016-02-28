exports.errorTypes = errorTypes();
exports.MarvinError = MarvinError;

function newResponse() {
	return {
		"code": null,
	    "message": null,
	    "data": {}
	};
}

exports.success = function(data) {
	var response = newResponse();
	response.code = 200;
	response.data = data;
	return response;
};

exports.error = function(err) {
	var response = newResponse();
	response.code = err.code;
	response.message = err.message;
	return response;
};

function errorTypes() {
	return {
		incorrectParameters : {
			code : 400,
			message : 'Incorrect or missing parameters.'
		},
		unauthorized : {
			code : 403,
			message : 'Failed to authenticate token.'
		},
		noTokenProvided : {
			code : 403,
			message : 'No token provided.'
		},
		notFound : {
			code : 403,
			message : 'Not found.'
		},
		wrongPassword : {
			code : 403,
			message : 'Wrong password.'
		},
		accessDenied : {
			code : 403,
			message : 'Access denied.'
		},
		emailInUse : {
			code : 403,
			message : 'Email already in use.'
		},
		internalServerError : {
			code : 500,
			message : 'Internal server error. Fancy trying again in a minute or so?'
		}
	};
}

function MarvinError(err) {
	this.code = err.code;
    this.message = err.message;
	this.stack = (new Error()).stack;
}
EventoiError.prototype = Object.create(Error.prototype);
EventoiError.prototype.constructor = EventoiError;
