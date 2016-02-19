function newResponse() {
	return {
		"code": null,
	    "message": null,
	    "data": {}
	};
}

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
		userNotFound : {
			code : 403,
			message : 'User not found.'
		},
		wrongPassword : {
			code : 403,
			message : 'Wrong password.'
		},
		internalServerError : {
			code : 500,
			message : 'Internal server error. Fancy trying again in a minute or so?'
		}
	};
}

exports.success = function(data) {
	var response = newResponse();
	response.code = 200;
	response.data = data;
	return response;
};

exports.error = function(code, msg) {
	var response = newResponse();

	if (!msg) {
		response.code = code;
		response.message = msg;
	} else {
		response.code = errorTypes()[code].code;
		response.message = errorTypes()[code].message;
	}

	return response;
};

exports.errorTypes = errorTypes();
