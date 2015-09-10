var _ = require('lodash');

module.exports = function(text) {
	var response = JSON.parse(text);
	if (!_.isUndefined(response.data))
		response.data = parseResourceData(response, response.data);
	return response;
};

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
		if (_.isArray(value.data)) {
			Object.defineProperty(result, name, { get: _.memoize(function() {
				return _(value.data).map(function(item) {
					var resdata = _.find(response.included, function(inc) {
						return inc.id === item.id;
					});
					if(resdata)
						return parseResourceDataObject(response, resdata);
				}).compact().value();
			}) });
		} else if (value.data) {
			Object.defineProperty(result, name + '_id', { value: value.data.id });
			Object.defineProperty(result, name, { get: _.memoize(function() {
				var resdata = _.find(response.included, function(inc) {
					return inc.id === value.data.id;
				});
				return resdata ? parseResourceDataObject(response, resdata)
				               : null;
			}) });
		}
	});
	return result;
}
