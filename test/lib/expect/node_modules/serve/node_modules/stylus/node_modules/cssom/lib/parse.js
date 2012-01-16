//.CommonJS
var CSSOM = {
	CSSStyleSheet: require("./CSSStyleSheet").CSSStyleSheet,
	CSSStyleRule: require("./CSSStyleRule").CSSStyleRule,
	CSSImportRule: require("./CSSImportRule").CSSImportRule,
	CSSMediaRule: require("./CSSMediaRule").CSSMediaRule,
	CSSStyleDeclaration: require('./CSSStyleDeclaration').CSSStyleDeclaration,
	CSSKeyframeRule: require('./CSSKeyframeRule').CSSKeyframeRule,
	CSSKeyframesRule: require('./CSSKeyframesRule').CSSKeyframesRule
};
///CommonJS


/**
 * @param {string} token
 * @param {Object} [options]
 */
CSSOM.parse = function parse(token, options) {

	options = options || {};
	var i = options.startIndex || 0;

	/**
	  "before-selector" or
	  "selector" or
	  "atRule" or
	  "atBlock" or
	  "before-name" or
	  "name" or
	  "before-value" or
	  "value"
	*/
	var state = options.state || "before-selector";

	var index;
	var j = i;
	var buffer = "";

	var SIGNIFICANT_WHITESPACE = {
		"selector": true,
		"value": true,
		"atRule": true,
		"importRule-begin": true,
		"importRule": true,
		"atBlock": true
	};

	var styleSheet = new CSSOM.CSSStyleSheet;

	// @type CSSStyleSheet|CSSMediaRule
	var currentScope = styleSheet;
	
	var selector, name, value, priority="", styleRule, mediaRule, importRule, keyframesRule, keyframeRule;

	for (var character; character = token.charAt(i); i++) {

		switch (character) {

		case " ":
		case "\t":
		case "\r":
		case "\n":
		case "\f":
			if (SIGNIFICANT_WHITESPACE[state]) {
				buffer += character;
			}
			break;

		// String
		case '"':
			j = i + 1;
			index = token.indexOf('"', j) + 1;
			if (!index) {
				throw '" is missing';
			}
			buffer += token.slice(i, index);
			i = index - 1;
			switch (state) {
				case 'before-value':
					state = 'value';
					break;
				case 'importRule-begin':
					state = 'importRule';
					break;
			}
			break;

		case "'":
			j = i + 1;
			index = token.indexOf("'", j) + 1;
			if (!index) {
				throw "' is missing";
			}
			buffer += token.slice(i, index);
			i = index - 1;
			switch (state) {
				case 'before-value':
					state = 'value';
					break;
				case 'importRule-begin':
					state = 'importRule';
					break;
			}
			break;

		// Comment
		case "/":
			if (token.charAt(i + 1) == "*") {
				i += 2;
				index = token.indexOf("*/", i);
				if (index == -1) {
					throw SyntaxError("Missing */");
				} else {
					i = index + 1;
				}
			} else {
				buffer += character;
			}
			if (state == "importRule-begin") {
				buffer += " ";
				state = "importRule";
			}
			break;

		// At-rule
		case "@":
			if (token.indexOf("@media", i) == i) {
				state = "atBlock";
				mediaRule = new CSSOM.CSSMediaRule;
				mediaRule.__starts = i;
				i += "media".length;
				buffer = "";
				break;
			} else if (token.indexOf("@import", i) == i) {
				state = "importRule-begin";
				i += "import".length;
				buffer += "@import";
				break;
			} else if (token.indexOf("@-webkit-keyframes", i) == i) {
				state = "keyframesRule-begin";
				keyframesRule = new CSSOM.CSSKeyframesRule;
				keyframesRule.__starts = i;
				i += "-webkit-keyframes".length;
				buffer = "";
				break;
			} else if (state == "selector") {
				state = "atRule";
			}
			buffer += character;
			break;

		case "{":
			if (state == "selector" || state == "atRule") {
				styleRule.selectorText = buffer.trimRight();
				styleRule.style.__starts = i;
				buffer = "";
				state = "before-name";
			} else if (state == "atBlock") {
				mediaRule.media.mediaText = buffer.trim();
				mediaRule.parentRule = currentScope;
				currentScope = mediaRule;
				buffer = "";
				state = "before-selector";
			} else if (state == "keyframesRule-begin") {
				keyframesRule.name = buffer.trimRight();
				keyframesRule.parentRule = currentScope;
				currentScope = keyframesRule;
				buffer = "";
				state = "keyframeRule-begin";
			} else if (state == "keyframeRule-begin") {
				styleRule = new CSSOM.CSSKeyframeRule;
				styleRule.keyText = buffer.trimRight();
				styleRule.__starts = i;
				buffer = "";
				state = "before-name";
			}
			break;

		case ":":
			if (state == "name") {
				name = buffer.trim();
				buffer = "";
				state = "before-value";
			} else {
				buffer += character;
			}
			break;

		case '(':
			if (state == 'value') {
				index = token.indexOf(')', i + 1);
				if (index == -1) {
					throw i + ': unclosed "("';
				}
				buffer += token.slice(i, index + 1);
				i = index;
			} else {
				buffer += character;
			}
			break;

		case "!":
			if (state == "value" && token.indexOf("!important", i) === i) {
				priority = "important";
				i += "important".length;
			} else {
				buffer += character;
			}
			break;

		case ";":
			switch (state) {
				case "value":
					styleRule.style.setProperty(name, buffer.trim(), priority);
					priority = "";
					buffer = "";
					state = "before-name";
					break;
				case "atRule":
					buffer = "";
					state = "before-selector";
					break;
				case "importRule":
					importRule = new CSSOM.CSSImportRule;
					importRule.parentRule = currentScope;
					importRule.cssText = buffer + character;
					currentScope.cssRules.push(importRule);
					buffer = "";
					state = "before-selector";
					break;
				default:
					buffer += character;
					break;
			}
			break;

		case "}":
			switch (state) {
				case "value":
					styleRule.style.setProperty(name, buffer.trim(), priority);
					priority = "";
				case "before-name":
				case "name":
					styleRule.__ends = i + 1;
					styleRule.parentRule = currentScope;
					currentScope.cssRules.push(styleRule);
					buffer = "";
					if (currentScope.constructor == CSSOM.CSSKeyframesRule) {
						state = "keyframeRule-begin";
					} else {
						state = "before-selector";
					}
					break;
				case "keyframeRule-begin":
				case "before-selector":
				case "selector":
					// End of media rule.
					// Nesting rules aren't supported yet
					if (!currentScope.parentRule) {
						throw "unexpected }";
					}
					currentScope.__ends = i + 1;
					currentScope.parentRule.cssRules.push(currentScope);
					currentScope = currentScope.parentRule;
					buffer = "";
					state = "before-selector";
					break;
			}
			break;

		default:
			switch (state) {
				case "before-selector":
					state = "selector";
					styleRule = new CSSOM.CSSStyleRule;
					styleRule.__starts = i;
					break;
				case "before-name":
					state = "name";
					break;
				case "before-value":
					state = "value";
					break;
				case "importRule-begin":
					state = "importRule";
					break;
			}
			buffer += character;
			break;
		}
	}

	return styleSheet;
};


//.CommonJS
exports.parse = CSSOM.parse;
///CommonJS
