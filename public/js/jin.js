function execCode(cid) {

}

var Jin = function() {
  var socket = io(),
      nickname = prompt('이름이 뭐요?'),
      editors = {},
      msg, cid = 0,

      changeCodeMode = function() {
        if(cid == 0) {
          socket.emit('code status', { username: nickname, status: 'start', cid: Date.now() });
        } else {
          socket.emit('code status', { username: nickname, status: 'end', cid: cid });
        }
      },

      runCode = function() {
        var editorid = $(this).attr('data-id');

        socket.emit('exec code', { cid: editorid , body: editors['cid'+editorid].getValue() });
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

  $('#codebox').bind('keyup', function(event) {
    msg.type = Protocol.chat.CODE;
    msg.body = $('#codebox').val();
    msg.cid = cid;

    socket.emit('chat message', msg);
  });

  $('#chatbox').focus();
  $('.codemode').click(changeCodeMode);

  socket.on('chat message', function(data){
    if(!!data.cid) {
      editors['cid'+data.cid].setValue(data.body);
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
        cid = data.cid;
      }

      var tmpl = $("#code-template").html();

      $('#messages').append($( Mustache.render(tmpl, { owner: data.username, editorid: data.cid }) ));

      editors['cid'+data.cid] = CodeMirror(document.getElementById('cid'+data.cid), {
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true
      });

      $('#box'+data.cid+' .code-run').bind('click', runCode);
    } else {
      if(data.username == nickname) {
        $('.codemode').removeClass('on').addClass('off');
        $('#chatbox').show().focus();
        $('#codebox').hide();

        cid = 0;
      }
    }
  });

  socket.on('exec code', function(data) {
    $('#box'+data.cid+' .output pre').text(data.body);
    $('#box'+data.cid+' .output').show();
  });
};

window.onload = Jin;