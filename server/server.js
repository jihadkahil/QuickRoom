require('./config/config');
var bodyParser = require('body-parser')
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var {mongoose} = require('./db/mongoose');


var app = new express();
app.use(bodyParser);
var server = http.createServer(app);
var io = socketIO(server);

var {ChatRoom} = require('./models/chatroom');

const port = process.env.PORT || 3000;



app.post('/registration',(req,res)=>{
    
    
    res.send('Success');
})

// io.on('connection',(socket)=>{
  
//     var chatRoom = new ChatRoom({name:'LWCAPP'});
//     chatRoom.save().then((user)=>{
//         console.log(user);
//     }).catch((e)=>{
//         console.log(e);
//     })

// io.emit('userJoin',{succes:true})

// });



server.listen(port,()=>{
    console.log(port);
})