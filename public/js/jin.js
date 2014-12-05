var Jin = function() {
  var socket = io();
  var nickname = prompt('이름이 뭐요?');
  var cid = 0;
  var applyHighlight = function() {
    $('#cid'+cid).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  $('form').submit(function() {
    socket.emit('chat message', nickname+'#'+$('#m').val());

    $('#m').val('');
    return false;
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

  socket.on('chat message', function(data){
    var msg = data.split('#');

    if(!!cid) {
      $('#cid'+cid+' code').append(msg[1]+'\n');

      applyHighlight();
    } else {
      $('#messages').append($('<li><img class="profile" src="'+msg[0]+'">'+msg[1]+'</li>'));
    }
  });
};

window.onload = Jin;