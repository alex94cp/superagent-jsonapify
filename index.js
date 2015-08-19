var _ = require('lodash');

module.exports = function(request) {
	request.parse['application/vnd.api+json'] = parseJsonApi;
};

function parseJsonApi(res, callback) {
	res.text = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		res.text += chunk.replace(/^\s*|\s*$/g, '');
	});
	res.on('end', function() {
		try {
			var response = JSON.parse(res.text);
			if (!_.isUndefined(response.data))
				response.data = parseResourceData(response, response.data);
			callback(null, response);
		} catch (err) {
			callback(err);
		}
	});
}

function parseResourceData(response, data) {
	if (!data) {
		return data;
	} else if (_.isArray(data)) {
		return _.map(data, _.partial(parseResourceDataObject, response));
	} else {
		return parseResourceDataObject(response, data);
	}
}

function parseResourceDataObject(response, data) {
	var result = {};
	Object.defineProperties(result, {
		id: { value: data.id },
		type: { value: data.type },
	});
	_.each(data.attributes, function(value, name) {
		Object.defineProperty(result, name, { value: value });
	});
	_.each(data.relationships, function(value, name) {
		Object.defineProperty(result, name, { get: _.memoize(function() {
			var resdata = _.find(response.included, value);
			return parseResourceDataObject(response, resdata);
		}) });
	});
	return result;
}
