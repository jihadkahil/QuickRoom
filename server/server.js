require('./config/config');
var bodyParser = require('body-parser')
const express = require('express');
const http = require('http');
var _ = require('lodash');
const socketIO = require('socket.io');



var {mongoose} = require('./db/mongoose');
var {authentication} = require('./midelleware/authentication');
var {User} = require('./models/user');

var app = new express();
app.use(bodyParser.json());
var server = http.createServer(app);
var io = socketIO(server);

var {ChatRoom} = require('./models/chatroom');

const port = process.env.PORT || 3000;

app.post('/registration',(req,res)=>{
    
    var body = _.pick(req.body,['email','password']);

    var user = new User(body);
    user.save().then(()=>{

        return user.generateAuthenticationToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{

        console.log('the roor',e);
        if(e)
        {
            if(e.code===11000)
           return res.status('401').send({error:'this email is already exist'});
           else
           return res.status('402').send({error:'email invalid'});
        }
    });


   
});


app.post('/login',(req,res)=>{

    var body = _.pick(req.body,['email','password']);

    var user_ ;
    User.findByCredentials(body.email,body.password).
    then((user)=>{
        user_ = user;
        return user.generateAuthenticationToken();
    }).then((token)=>{
        console.log(token);
        res.header('x-auth',token).send(user_);
    }).catch((e)=>{
        console.log(e);
        res.status(400).send({error:e});
    })

});

app.delete('/logout',authentication,(req,res)=>{

    console.log(req.user);
    req.user.removeToken(req.token).then((user)=>{
        res.status(200).send({success:true});
    }).catch((e)=>{
        res.status(400).send({error:e});
    })

});

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