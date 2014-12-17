'use strict';

Polymer({
  socket: io(),
  nickname: '',
  cid: 0,
  msg: '',
  chatMessages: [],

  applyHighlight: function() {
    $('#cid'+this.cid).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  },

  toogleLanguage: function() {
    if(this.$.c.checked) {
      this.cid = Date.now();

      this.socket.emit('chat message', this.nickname+'#'+'/* code here ... */\n');
    } else {
      this.cid = 0;
    }
  },

  msgChanged: function() {
    var msg = Protocol.chat();

    if(this.msg[this.msg.length-1] == '~') {
      msg.type = Protocol.chat.MESSAGE;
      msg.username = this.nickname;
      msg.body = this.msg;

      this.socket.emit('chat message', msg);
      this.msg = '';
    }
  },

  ready: function() {
    var $scope = this;

    Protocol.defineMessage('chat', {
      username: String,
      type: ['MESSAGE','CODE'],
      cid: Number,
      body: String
    });

    this.nickname = prompt('이름이 뭐에요?');

    this.socket.on('chat message', function(msg){
      var chatTemplate = $scope.$['chat-message'];
      var codeTemplate = $scope.$['code-message'];
      var clone = document.importNode(chatTemplate.content, true);
      var type = !!$scope.cid ? Protocol.chat.CODE : Protocol.chat.MESSAGE;

      $scope.chatMessages.push({
        type: type,
        user: msg.username,
        body: msg.body
      });

      $scope.$.messages.appendChild(clone); // host

      if(!!this.cid) {
        $('#cid'+this.cid+' code').append(msg.body+'\n');

        applyHighlight();
      } else {
        $('#messages').append($('<li><img class="profile" src="'+msg.username+'">'+msg.body+'</li>'));
      }

    });
  }
});
