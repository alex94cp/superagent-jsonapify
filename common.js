var _ = require('lodash');

exports.parse = function(text) {
	var response = JSON.parse(text);
	if (!_.isUndefined(response.data))
		response.data = parseResourceData(response, response.data);
	return response;
};

exports.serialize = JSON.stringify;

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
	var result = _.clone(data);
	_.each(data.attributes, function(value, name) {
		Object.defineProperty(result, _.camelCase(name), { value: value });
	});
	_.each(data.relationships, function(value, name) {
		if (_.isArray(value.data)) {
			Object.defineProperty(result, _.camelCase(name), {
				get: _.memoize(function() {
					return _(value.data).map(function(related) {
						var resdata = _.find(response.included, 'id', related.id);
						if(resdata)
							return parseResourceDataObject(response, resdata);
					}).compact().value();
				})
			});
		} else if (value.data) {
			Object.defineProperty(result, _.camelCase(name), {
				get: _.memoize(function() {
					var resdata = _.find(response.included, 'id', value.data.id);
					return resdata ? parseResourceDataObject(response, resdata)
					               : null;
				})
			});
		}
	});
	return result;
}
