var Jin = function() {
  var socket = io(),
      nickname = prompt('이름이 뭐요?'),
      msg, cid = 0,
      applyHighlight = function() {
        $('#cid'+cid).each(function(i, block) {
          hljs.highlightBlock(block);
        });
      };

  Protocol.defineMessage('chat', {
    username: String,
    type: ['MESSAGE','CODE'],
    cid: Number,
    body: String
  });

  msg = Protocol.chat();
  msg.username = nickname;

  $('#chatbox').change(function() {
    if($('#codemode').prop('checked')) {
      msg.type = Protocol.chat.MESSAGE;
      msg.body = $('#chatbox').val();

      socket.emit('chat message', msg);
    }

    $('#chatbox').val('');
  });

  $('#chatbox').bind('keypress', function(event) {
    if(!$('#codemode').prop('checked')) return;

    msg.type = Protocol.chat.CODE;
    msg.body = event.key;

    socket.emit('chat message', msg);
  });

  $('#chatbox').focus();

  $('#codemode').bind('click', function() {
    var isStart = $('#codemode').prop('checked');

    if(isStart) {
      cid = Date.now();

      $('#messages').append($('<li><pre id="cid'+cid+'" class="prettyprint linenums"><code class="javascript lineNumbers">/* code here ... */\n</code></pre>'));

      applyHighlight();
    } else {
      cid = 0;
    }
  });

  socket.on('chat message', function(data){
    if(!!cid) {
      $('#cid'+cid+' code').append(data.body);
      applyHighlight();
    } else {
      $('#messages').append($('<li><span class="username">'+data.username+'</span>'+data.body+'</li>'));
    }
  });
};

window.onload = Jin;