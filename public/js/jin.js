var Jin = function() {
  var socket = io();
  var nickname = prompt('이름이 뭐요?');
  var cid = 0;
  var applyHighlight = function() {
    $('#cid'+cid).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  Protocol.defineMessage('chat', {
    username: String,
    type: ['MESSAGE','CODE'],
    cid: Number,
    body: String
  });

  $('#chatbox').change(function() {
    var msg = Protocol.chat();

    msg.type = Protocol.chat.MESSAGE;
    msg.username = nickname;
    msg.body = $('#chatbox').val();

    $('#chatbox').val('');

    socket.emit('chat message', msg);
  });

  $('#c').bind('click', function() {
    var isStart = $('#c').prop('checked');

    if(isStart) {
      cid = Date.now();

      $('#messages').append($('<li><pre id="cid'+cid+'" class="prettyprint linenums"><code class="javascript lineNumbers">/* code here ... */\n</code></pre>'));

      applyHighlight();
    } else {
      cid = 0;
    }
  });

  socket.on('chat message', function(msg){
    // var msg = data.split('#');

    if(!!cid) {
      $('#cid'+cid+' code').append(msg.body+'\n');

      applyHighlight();
    } else {
      $('#messages').append($('<li><span class="username">'+msg.username+'</span>'+msg.body+'</li>'));
    }
  });
};

window.onload = Jin;