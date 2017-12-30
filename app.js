var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server Started");
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var playerOne;
var playerTwo;
var Player = function(id) {
  return id;
}
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;
  if (!playerOne) {
    playerOne = socket.id;
    console.log("Player One Connected");
    socket.emit("1");
  }
  else if (!playerTwo) {
    playerTwo = socket.id;
    console.log("Player Two Connected");
    socket.emit("2");
  }
  else PLAYER_LIST[socket.id] = Player(socket.id);
  console.log("socket connection");
  socket.on("array", function(data) {
    io.sockets.emit("oppositeArray", data);
  });
});
