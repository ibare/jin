var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);

server.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('connection');

  socket.on('chat message', function(data){
    console.log(data);
    io.emit('chat message', data);
  });

  socket.on('code status', function(data){
    console.log(data);
    io.emit('code status', data);
  });

  socket.on('exec code', function(data) {
    console.log(data);

    fs.writeFile("./tmp/my.js", data.body, function(err) {
      if(err) {
        console.log(err);
        return;
      }

      var child = exec('node ./tmp/my.js', function(err, stdout, stderr) {
        if (err) console.log(err);
        else io.emit('exec code', { cid: data.cid, body: stdout });
      });
    });
  });
});

http.listen(process.env.PORT || 8080, function() {
  console.log('Jin server listening on *:8080');
});