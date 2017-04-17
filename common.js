var _isUndefined = require('lodash/isUndefined');
var _isArray = require('lodash/isArray');
var _map = require('lodash/map');
var _partial = require('lodash/partial');
var _each = require('lodash/each');
var _camelCase = require('lodash/camelCase');
var _memoize = require('lodash/memoize');
var _chain = require('lodash/chain');
var _find = require('lodash/find');
var _clone = require('lodash/clone');
var _compact = require('lodash/compact');

exports.parse = function(text) {
	var response = JSON.parse(text);
	if (!_isUndefined(response.data))
		response.data = parseResourceData(response, response.data);
	return response;
};

exports.serialize = JSON.stringify;

function parseResourceData(response, data) {
	if (!data) {
		return data;
	} else if (_isArray(data)) {
		return _map(data, _partial(parseResourceDataObject, response));
	} else {
		return parseResourceDataObject(response, data);
	}
}

function parseResourceDataObject(response, data) {
	var result = _clone(data);
	_each(data.attributes, function(value, name) {
		Object.defineProperty(result, _camelCase(name), { value: value, enumerable: true });
	});
	_each(data.relationships, function(value, name) {
		if (_isArray(value.data)) {
			Object.defineProperty(result, _camelCase(name), {
				get: _memoize(function() {
					var related = _map(value.data, function(related) {
						var resdata = _find(response.included, function(included) {
							return included.id === related.id && included.type === related.type;
						});
						if(resdata)
							return parseResourceDataObject(response, resdata);
					});
					return _compact(related);
				}),
				enumerable: true
			});
		} else if (value.data) {
			Object.defineProperty(result, _camelCase(name), {
				get: _memoize(function() {
					var resdata = _find(response.included, function(included) {
						return included.id === value.data.id && included.type === value.data.type;
					});
					return resdata ? parseResourceDataObject(response, resdata)
					               : null;
				}),
				enumerable: true
			});
		}
	});
	return result;
}
