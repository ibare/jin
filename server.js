var path = require('path');
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);

server.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('connection');

  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('code status', function(data){
    console.log(data);
    io.emit('code status', data);
  });
});

http.listen(process.env.PORT || 8080, function() {
  console.log('Jin server listening on *:8080');
});