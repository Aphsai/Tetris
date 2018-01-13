var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(3000);
console.log("Server Started");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var playerCount = false;
var initialId = 0;

var Player = function(id, opponent) {
  return player = {
    id:id,
    opponent:opponent
  };
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
  SOCKET_LIST[socket.id] = socket;
  socket.on('playerConnected', function() {
    if (!playerCount) {
      playerCount = true;
      initialId = socket.id;
    }
    else {
      playerCount = false;
      PLAYER_LIST[initialId] = new Player(initialId, socket.id);
      PLAYER_LIST[socket.id] = new Player(socket.id, initialId);
      console.log(initialId + " " + socket.id);
      console.log()
      io.to(initialId).emit('BPCONNECTED', initialId);
      io.to(socket.id).emit('BPCONNECTED', socket.id);
      initialId = 0;
    }
  });
  socket.on("array", function(data) {
    if (data[0].player != 0 && PLAYER_LIST[data[0].player] != null)
      io.to(PLAYER_LIST[data[0].player].opponent).emit("oppositeArray", data);
  });
  socket.on("lineSent", function(data) {
    if (data[0].player != 0)
      io.to(PLAYER_LIST[data[0].player].opponent).emit("lineSent", data);
  });
  socket.on('disconnect', function() {
    if (PLAYER_LIST[socket.id]) {
      var opponent = PLAYER_LIST[PLAYER_LIST[socket.id].opponent];
      if (initialId != 0) {
      opponent.opponent = initialId;
      PLAYER_LIST[initialId] = new Player(initialId, opponent.id);
      io.to(opponent.id).emit("reset");
      }
      else {
        initialId = opponent.id;
        playerCount = true;
        io.to(opponent.id).emit("left");
          PLAYER_LIST[opponent.id] = null;
      }
      PLAYER_LIST[socket.id] = null;
    }
  });
});
