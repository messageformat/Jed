/**
 * @param {string} actual
 * @param {string} expected
 * @param {string} [message]
 * TODO: http://github.com/jquery/qunit/issues#issue/39
 */
function equalOwnProperties(actual, expected, message) {
	var actualDummy = cloneOwnProperties(actual);
	var expectedDummy = cloneOwnProperties(expected);
	deepEqual(actualDummy, expectedDummy, message);
}


/**
 * Make a deep copy of an object
 * @param {Object|Array} object
 * @params {Array} [stack]
 * @return {Object|Array}
 */
function cloneOwnProperties(object, stack) {
	stack = stack || [];
	stack.push(object);
	var result = {};
	for (var key in object) {
		if (key.charAt(0) == "_" || !object.hasOwnProperty(key)) {
			continue;
		}
		if (typeof object[key] == "object") {
			var stackIndex = stack.indexOf(object[key]);
			if (stackIndex > -1) {
				result[key] = buildPath(stack.length - stackIndex);
			} else {
				result[key] = cloneOwnProperties(object[key], stack);
			}
		} else {
			result[key] = object[key];
		}
	}
	return result;
}


/**
 * buildPath(2) -> '../..'
 * @param {number} level
 * @return {string}
 */
function buildPath(level) {
	if (level == 0) {
		return '.';
	} else {
		var result = '..';
		for (var i = 1; i < level; i++) {
			result += '/..';
		}
		return result;
	}
}


/**
 * @param {Object|Array} actual
 * @param {Object|Array} expected
 * @param {string} message
 */
function hasOwnProperties(actual, expected, message){
	var diff = subsetOfOwnProperties(actual, expected);
	if (diff) {
		QUnit.push(false, diff, {}, message);
	} else {
		// QUnit.jsDump is so dumb. It can't even parse circular references.
		QUnit.push(true, "okay", "okay", message);
	}
}


function subsetOfOwnProperties(base, another) {
	if (base === another) {
		return false;
	}

	if (typeof base != "object" || typeof another != "object") {
		return another;
	}

	var diff = {};
	var isDiff = false;
	for (var key in another) {
		if (key.charAt(0) == "_" || !another.hasOwnProperty(key)) {
			continue;
		}
		if (key in base) {
			if (base[key] === another[key]) {
				// skip equal pairs
			} else {
				var sub = subsetOfOwnProperties(base[key], another[key]);
				if (sub) {
					isDiff = true;
					diff[key] = sub;
				}
			}
		} else {
			isDiff = true;
			diff[key] = another[key];
		}
	}

	return isDiff ? diff : false;
}


/**
 * Compare two stylesheets
 * @param {string} css
 * @param {Object} expected
 * @param {string} [message]
 */
function compare(css, expected, message) {
	test(css, function() {
		equalOwnProperties(CSSOM.parse(css), expected, message || "");
	});
}
