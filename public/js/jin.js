var Jin = function() {
  var socket = io(),
      nickname = prompt('이름이 뭐요?'),
      editors = [],
      msg, cid = 0,

      changeCodeMode = function() {
        if(cid == 0) {
          socket.emit('code status', { username: nickname, status: 'start', id: Date.now() });
          // applyHighlight();
        } else {
          socket.emit('code status', { username: nickname, status: 'end', id: cid });
        }
      };

  Protocol.defineMessage('chat', {
    username: String,
    type: ['MESSAGE','CODE'],
    cid: Number,
    body: String
  });

  msg = Protocol.chat();
  msg.username = nickname;

  $('#chatbox').bind('keypress', function(event) {
    if(event.keyCode == 13) {
      msg.type = Protocol.chat.MESSAGE;
      msg.body = $('#chatbox').val();
      msg.cid = cid;

      socket.emit('chat message', msg);
    }
  });

  $('#codebox').bind('keypress', function(event) {
    msg.type = Protocol.chat.CODE;
    msg.body = !!event.keyCode && event.keyCode > 32  ? $('#codebox').val()+event.key : $('#codebox').val();
    msg.cid = cid;

    socket.emit('chat message', msg);
  });

  $('#chatbox').focus();
  $('.codemode').click(changeCodeMode);

  socket.on('chat message', function(data){
    if(!!data.cid) {
      editors['cid'+cid].setValue(data.body);
      // applyHighlight();
    } else {
      $('#chatbox').val('');
      $('#messages').append($('<li><span class="username">'+data.username+'</span>'+data.body+'</li>'));
    }
  });

  socket.on('code status', function(data) {
    $('#chatbox').val('');
    $('#codebox').val('');

    if(data.status == 'start') {
      if(data.username == nickname) {
        $('.codemode').removeClass('off').addClass('on');
        $('#chatbox').hide();
        $('#codebox').show().focus();
        cid = data.id;
      }

      $('#messages').append($('<li><div id="cid'+data.id+'" class="editor"></div>'));
      editors['cid'+data.id] = CodeMirror(document.getElementById('cid'+data.id), {
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true
      });
    } else {
      if(data.username == nickname) {
        $('.codemode').removeClass('on').addClass('off');
        $('#chatbox').show().focus();
        $('#codebox').hide();

        cid = 0;
      }
    }
  });
};

window.onload = Jin;