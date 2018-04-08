'use strict';
var RongLive = {};
(function(dependencies) {
	var RongLive = dependencies.RongLive;
	var console = dependencies.console || {};

	var request = function(options) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var result = xhr.responseText || "{}";
				result = JSON.parse(result);
				options.success && options.success(result);
			}
		};

		var method = options.url;
		var url = options.url;
		var method = options.method || 'GET';
		xhr.open(method, url);
		var headers = options.headers;
		for (var key in headers) {
			var value = headers[key];
			xhr.setRequestHeader(key, value);
		}
		var body = JSON.stringify(options.body);
		xhr.send(body);
	};

	var tplEngine = function(temp, data, regexp) {
		if (!(Object.prototype.toString.call(data) === "[object Array]")) {
			data = [data];
		}
		var ret = [];
		for (var i = 0, j = data.length; i < j; i++) {
			ret.push(replaceAction(data[i]));
		}
		return ret.join("");

		function replaceAction(object) {
			return temp.replace(regexp || (/{([^}]+)}/g), function(match, name) {
				if (match.charAt(0) == '\\') {
					return match.slice(1);
				}
				return (object[name] != undefined) ? object[name] : '{' + name + '}';
			});
		}
	};

	var noop = function() {};

	var extend = function(destination, sources) {
		destination = destination || {};
		for (var key in sources) {
			var value = sources[key];
			destination[key] = value;
		}
		return destination;
	};

	var isUndefinded = function(obj) {
		return Object.prototype.toString.call(obj) == '[object Undefined]';
	};

	var each = function(arrs, callback) {
		// TODO 扩展遍历 Object
		var len = arrs.length;
		for (var i = 0; i < len; i++) {
			var val = arrs[i];
			callback(val, i);
		}
	};

	var render = function(data, template) {
		template = template || "";
		data = data || [""];
		var re = /{{((?:(?!}}).)+)}}/g,
			reExp = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g,
			code = 'var r=[];\n',
			cursor = 0;
		var add = function(line, js) {
			js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}
		var match;
		while (match = re.exec(template)) {
			add(template.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(template.substr(cursor, template.length - cursor));
		code += 'return r.join("");';

		data = isNaN(data.length) ? [data] : data;
		var html = "";
		for (var i = 0, length = data.length; i < length; i++) {
			html += new Function(code.replace(/[\r\t\n]/g, '')).apply(data[i]);
		}
		return html;
	};

	var Logger = {};
	var logLevels = ['log', 'warn', 'error'];
	each(logLevels, function(level) {
		Logger[level] = console[level] || utils.noop;
	});

	var getDom = function(el){
		return document.getElementById(el);
	};

	var addEvent = function(el, event){
		var el = el || document;
		var name = event.name;
		var event = event.event;

		if (el.addEventListener) {
			el.addEventListener(name, event, false);
		}

		if (el.attachEvent) {
			el.attachEvent('on' + name, event);
		}
	};

	var removeEvent = function(el, event){
		var el = el || document;
		var name = event.name;
		var event = event.event || noop;

		if (el.removeEventListener) {
			el.removeEventListener(name, event, false)
		}
		if (el.detachEvent) {
			el.detachEvent('on' + name, event);
		}
	};

	extend(RongLive, {
		utils: {
			request: request,
			tplEngine: tplEngine,
			noop: noop,
			extend: extend,
			isUndefinded: isUndefinded,
			render: render,
			each: each,
			getDom: getDom,
			addEvent: addEvent,
			removeEvent: removeEvent,
			Logger: Logger
		}
	});

})({
	console: console,
	RongLive: RongLive
});