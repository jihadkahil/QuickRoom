const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;
io.on('connection',(socket)=>{
  

io.emit('userJoin',{succes:true})

});



server.listen(port,()=>{
    console.log(port);
})