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