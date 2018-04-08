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