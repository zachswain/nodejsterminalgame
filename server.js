//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var Client = require("./Client");
var Storage = require("./Storage");

var app = {
  storage : new Storage()
};

// console.log("user exists: " + app.storage.userExists({ name : 'jaede' }));
// console.log("create user: ");
// console.log(app.storage.createUser("jaede", "test"));

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];
var clients = [];

io.on('connection', function (socket) {
  console.log("received connection");
  
  sockets.push(socket);
  
  var client = new Client(app, socket);
  clients.push(client);

  socket.on('disconnect', function () {
    console.log("disconnected");
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Tradewars listening at", addr.address + ":" + addr.port);
});
