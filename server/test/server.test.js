require('../config/config');
var {ChatRoom} = require('../models/chatroom');
const expect = require('expect');

var {mongoose} = require('../db/mongoose');



describe('it should creat a chatRoom',()=>{

    it('shoud create a chatRoom',(done)=>{
        console.log('Ola')
        var chatRoom = new ChatRoom({name:'LWCT'});
        console.log('Ola')
        chatRoom.save().then((chat)=>{

            console.log(chat);
            expect(chat.name).toBe('LWCT')
            done();
        
        },(e)=>{
            console.log(chat);
            done();
        }).catch((e)=>{
            console.log(e);
            done(e);
        });

    })
})