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

"use strict";
(function(dependencies){
	var global = dependencies.global;
	var RongLive = global.RongLive;
	var utils = RongLive.utils;

	var getUser = () => {

		var nameList = "梦琪忆柳之桃慕青问兰尔岚元香初夏沛菡傲珊曼文乐菱痴珊恨玉惜文香寒新柔语蓉海安夜蓉涵柏水桃醉蓝春儿语琴从彤傲晴语兰又菱碧彤元霜怜梦紫寒妙彤曼易南莲紫翠雨寒易烟如萱若南寻真晓亦向珊慕灵以蕊寻雁映易雪柳孤岚笑霜海云";
		var nameSize = nameList.length;

		var portraits = [
			'https://rongcloud-image.cn.ronghub.com/11b5634363a0d64375.gif?e=2147483647&token=livk5rb3__JZjCtEiMxXpQ8QscLxbNLehwhHySnX:KXWfwD_8iNCsvyOtDFjviEMVAZI=',
			'http://7xogjk.com1.z0.glb.clouddn.com/01fac54313ad977d6e.gif',
			'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957',
			'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1480657489396230957',
			'http://7xogjk.com1.z0.glb.clouddn.com/FrHE6oexmBYCQu1mArslDmSXSpjt',
			'http://7xogjk.com1.z0.glb.clouddn.com/N5zNVXSAL1468383079822445801',
			'http://7xogjk.com1.z0.glb.clouddn.com/Fh4fnCvnO_SOwpuMPYGBnzBwrx6A',
			'http://7xogjk.com1.z0.glb.clouddn.com/FhNGcU1t9fqeY8RNU9YLxB_uC0CW',
			'http://7xogjk.com1.z0.glb.clouddn.com/VvnIxO8tV1466543937625991943',
			'http://7xogjk.com1.z0.glb.clouddn.com/8ydpAQGf31466593526225904053',
			'http://7xogjk.com1.z0.glb.clouddn.com/J7XqKPint1465875994761060059',
			'http://7xogjk.com1.z0.glb.clouddn.com/FuN4PYLWgl5-dc7kjMrVTaGrmvWy',
			'http://7xogjk.com1.z0.glb.clouddn.com/E1IoyL5Pj1474883226760875000',
			'http://7xogjk.com1.z0.glb.clouddn.com/Fs9ncOF6YdUFm41MLaaW3Le9kCUi',
			'http://7xogjk.com1.z0.glb.clouddn.com/40qHVS1mE1466594886916926758',
			'http://7xogjk.com1.z0.glb.clouddn.com/FnD5DPrQ4zEuxdfoQph3I_GbREXT',
			'http://7xogjk.com1.z0.glb.clouddn.com/sIY8bjZD41488598710906941895',
			'http://7xogjk.com1.z0.glb.clouddn.com/uQkgVavwI1487366848354141846',
			'http://7xogjk.com1.z0.glb.clouddn.com/6LTeWiKdO1466687530424623047',
			'http://7xogjk.com1.z0.glb.clouddn.com/dF4rToXYc1480663399693231201',
			'http://7xogjk.com1.z0.glb.clouddn.com/RhkYq7by11466683458989444092',
			'http://7xogjk.com1.z0.glb.clouddn.com/RhkYq7by11466683458989444092',
			'http://7xogjk.com1.z0.glb.clouddn.com/dCbdBuAEY1466683558456824951',
			'http://7xogjk.com1.z0.glb.clouddn.com/1wqmFbjA11487060547968788086',
			'http://7xogjk.com1.z0.glb.clouddn.com/Frvl4caHWNcn3HirhUH-4VUfeZh5',
			'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982',
			'http://7xogjk.com1.z0.glb.clouddn.com/FoT92qisblAl4-fNyRFhsMvx_1Re',
			'http://7xogjk.com1.z0.glb.clouddn.com/jxngOLzx81490001167151286133',
			'http://7xogjk.com1.z0.glb.clouddn.com/jAR4Mcond1466728471015025146',
			'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1466575289048886963'
		];

		var portraitSize = portraits.length;

		var getIndex = (max) => {
			return Math.floor(Math.random() * max);
		};

		var getName = (len) => {
			var names = [];
			for (var i = 0; i < len; i++) {
				var index = getIndex(nameSize);
				names.push(nameList[index]);
			}
			return names.join('');
		};

		var getPortrait = (index) => {
			return portraits[index];
		};

		var name = getName(3);

		var portraitIndex = getIndex(portraitSize);
		var portrait = getPortrait(portraitIndex);

		return {
			name: name,
			portrait: portrait
		};
	};

	/*
		var params = {};
		var user = {
			id: '',
			name: '',
			portrait: ''
		};
		var error = null;
		callback(error, user);
	*/
	var login = function(params, callback) {
		var user = getUser();
		var error = null;
		callback(error, user);
	};
	/*
		var tourist = {
			id: ''
		};
		var error = null;
		callback(error, tourist);
	*/

	var getTourist = function(callback) {
		var time = Date.now();
		var random = Math.floor(Math.random() * 500000);
		var id = (time + random).toString(16);

		var tourist = {
			id: id
		};
		var error = null;
		callback(error, tourist);
	};

	utils.extend(RongLive, {
		Service: {
			login: login,
			getTourist: getTourist
		}
	});
})({
	global: this
});

"use strict";
(function(dependencies) {
	var global = dependencies.global;
	var RongIMLib = dependencies.RongIMLib;

	var config = null;
	var utils = RongLive.utils;
	var Logger = utils.Logger;

	var Service = RongLive.Service;

	var IMClient = RongIMLib.RongIMClient;

	var imInstance = null;

	function Watcher() {

		var checkIndexOutBound = function(index, bound) {
			return index > -1 && index < bound;
		};

		this.observerList = [];

		this.add = function(observer, force) {
			force && (this.observerList.length = 0);
			this.observerList.push(observer);
		};

		this.get = function(index) {
			if (checkIndexOutBound(index, this.observerList.length)) {
				return this.observerList[index];
			}
		};

		this.count = function() {
			return this.observerList.length;
		};

		this.removeAt = function(index) {
			checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
		};

		this.remove = function(observer) {
			if (!observer) {
				this.observerList.length = 0;
				return;
			}
			observer = Object.prototype.toString.call(observer) == '[object Function]' ? [observer] : observer;
			for (var i = 0, len = this.observerList.length; i < len; i++) {
				if (this.observerList[i] === observer[i]) {
					this.removeAt(i);
					break;
				}
			}
		};

		this.notify = function(val) {
			for (var i = 0, len = this.observerList.length; i < len; i++) {
				this.observerList[i](val);
			}
		};

		this.indexOf = function(observer, startIndex) {
			var i = startIndex || 0,
				len = this.observerList.length;
			while (i < len) {
				if (this.observerList[i] === observer) {
					return i;
				}
				i++;
			}
			return -1;
		};
	}
	var watcher = new Watcher();

	var Cache = {
		currentUser: {}
	};

	/*
		用户加入
		var user = {
			name: '',
			portrait: ''
		};
	*/ 
	var login = function(user, callback) {
		callback = callback || utils.noop;
		Service.login(user, function(error, user){
			if (error) {
				Logger.error(error);
			}
			Cache.currentUser = user;

			var id = config.roomId;
			var count = config.historyCount;

			imInstance.joinChatRoom(id, count, {
				onSuccess: function() {
					callback();
				},
				onError: function(error) {
					Logger.error(error);
				}
			});
			
		});
	};

	var send = function(message, callback){
		var content = message.content;
		var user = Cache.currentUser;
		message = new RongIMLib.TextMessage({
			content: content,
			user: user
		});
		var type = RongIMLib.ConversationType.CHATROOM;
		var chatRoomId = config.roomId;

		var direction = RongIMLib.MessageDirection.SEND;
		callback({
			content: message,
			messageDirection: direction
		});
		imInstance.sendMessage(type, chatRoomId, message, {
			onSuccess: function(){},
			onError: function(error){
				Logger.error('sendMessage', error);
			}
		});
	};
	
	var watch = function(_watcher) {
		watcher.add(_watcher);
	};

	var connect = function() {
		var appkey = config.appkey;
		var sdk = config.sdk;
		IMClient.init(appkey, null, sdk);

		imInstance = IMClient.getInstance();

		var touristJoin = function() {
			var id = config.roomId;
			var count = config.historyCount;
			var order = 1;

			imInstance.getChatroomMessageList(id, count, {
				onSuccess: function() {
					Logger.warn('tourist join successfully');
				},
				onError: function(error) {
					Logger.error(error);
				}
			});
		};

		var Status = RongIMLib.ConnectionStatus;
		IMClient.setConnectionStatusListener({
			onChanged: function(status) {
				var isConnected = (status == Status.CONNECTED);
				if (isConnected) {
					touristJoin();
				}
			}
		});

		IMClient.setOnReceiveMessageListener({
			onReceived: function(message) {
				watcher.notify(message);
			}
		});

		Service.getTourist(function(error, tourist){
			if (error) {
				Logger.error(error);
				return;
			}
			var touristId = tourist.id;
			IMClient.connect(touristId, {
				onSuccess: function(userId) {
					Logger.log("Connect successfully." + userId);
				},
				onTokenIncorrect: function() {
					Logger.log('token无效');
				},
				onError: function(error) {
					console.error('connect', error);
				}
			});
		});
	};

	var apis;
	var init = function(_config) {
		if (utils.isUndefinded(apis)) {
			config = _config;
			connect();

			apis = {
				login: login,
				send: send,
				watch: watch
			};
		}

		return apis;
	};

	utils.extend(RongLive, {
		init: init
	});
})({
	RongLive: RongLive,
	RongIMLib: RongIMLib
});

"use strict";
(function(dependencies) {
	var global = dependencies.global;
	var RongIMEmoji = dependencies.RongIMEmoji;

	var RongLive = dependencies.RongLive;
	var utils = RongLive.utils;
	var config = null;

	var chrmTpl = [
		'<div class="rong-live">',
			'<div class="rong-live-msg-list" id="rong-live-msg-box">',
				
			'</div>',
			'<div class="rong-live-editor">',
				'<div class="rong-live-emoji-panel" id="rong-live-emoji-panel" style="display:none;">',
				'</div>',
				'<button class="rong-live-editor-emoji" id="rong-live-editor-emoji"></button>',
				'<textarea class="rong-live-editor-textarea" placeholder="说点什么..." ',
				'id="rong-live-editor"></textarea>',
			'</div>',
			'<div class="rong-live-login" id="rong-live-login">',
				'<span>点击登录</span>',
			'</div>',
		'</div>'
	].join('');

	var renderUI = function(data, tpl){
		var _tpl = [
			'<div class="rong-live-msg">',
				'<div class="rong-live-msg-sender">',
					'<div class="rong-live-avatar" style="background-image: url({{this.content.user.portrait}});"></div>',
				'</div>',
				'<div class="rong-live-name">',
					'{{this.content.user.name}}',
				'</div>',
				'<div class="rong-live-msg-content">',
					'{{this.content.content}}',
				'</div>',
			'</div>'
			].join('');
		tpl = tpl || _tpl
		return utils.render(data, tpl);
	};

	var ElID = {
		msgList: 'rong-live-msg-box',
		emojiList: 'rong-live-emoji-panel',
		emojiBtn: 'rong-live-editor-emoji',
		editor: 'rong-live-editor',
		login: 'rong-live-login'
	};

	var scrollTop = function(el){
		el.scrollTop = el.scrollHeight;
	};

	var init = function(_config) {
		config = _config;
		
		var el = config.el;
		if (!el) {
			throw new Error('config.el 参数不合法, 参数值为 DOM 对象， 例如: var el = document.getElementById("id")');
		}
		el.innerHTML += chrmTpl;

		var msgTpl = config.msgTpl;
		var updateMsgList = function(message){
			var msgBox = utils.getDom(ElID.msgList);
			var content = message.content.content;
			message.content.content = RongIMEmoji.emojiToHTML(content);
			var html = renderUI(message, msgTpl);
			msgBox.innerHTML += html;
			scrollTop(msgBox);
		};

		var rongLive = RongLive.init(config);
		rongLive.watch(function(message) {
			updateMsgList(message);
		});

		var EmojiCtrl = {
			show: function(el){
				el.style.display = 'block';
			},
			hide: function(el){
				el.style.display = 'none';
			}
		};

		RongIMEmoji.init();
		setTimeout(function(){
			var panel = utils.getDom(ElID.emojiList);
			var emojis = RongIMEmoji.list;
		    for (var i = 0; i < 40; i++) {
		        var value = RongIMEmoji.list[i];
		        panel.appendChild(value.node);
		    }
		    var sendEl = utils.getDom(ElID.editor);
		    panel.onclick = function(event){
		        var e = event || window.event;
		        var target = e.target || e.srcElement;
		        sendEl.value += RongIMEmoji.symbolToEmoji(target.getAttribute("name"));
		        EmojiCtrl.hide(panel);
		    }
		});

		var emojiBtn = utils.getDom(ElID.emojiBtn);
		emojiBtn.onclick = function(){
			var panel = utils.getDom(ElID.emojiList);
			EmojiCtrl.show(panel);
		};

		function login(el){
			var user = {};
			rongLive.login(user, function(){
				el.style = 'display: none;';
			});
		}
		setTimeout(function(){
			var loginEl = utils.getDom(ElID.login);
			utils.addEvent(loginEl, {
				name: 'click',
				event: function(e){
					login(loginEl);
					utils.removeEvent(loginEl, {
						name: 'click'
					});
				}
			});
		});

		function sendMessage(content) {
			rongLive.send({content: content}, updateMsgList);
		}

		setTimeout(function(){
			var sendEl = utils.getDom(ElID.editor);
			utils.addEvent(sendEl, {
				name: 'keyup',
				event: function(e){
					e.preventDefault();
					var isEnter = (e.keyCode == 13);
					if (isEnter) {
						var content = sendEl.value;
						sendMessage(content);
						setTimeout(function(){
							sendEl.value = '';
						});
					}
					return this.value;
				}
			});
		});
	}

	global.LiveRoom = {
		init: init
	};
})({
	global: this,
	RongLive: RongLive,
	RongIMEmoji: RongIMLib.RongIMEmoji
});