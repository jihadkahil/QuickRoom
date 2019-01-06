var mongoose = require('mongoose');

var ChatRoom = mongoose.model('ChatRoom',{

    name:{
        type:String,
        require:true,
        minLengh:3,
        unique:true

        
    }, createdAt: {
        type: Number,
        default: null
      }

});

module.exports = {ChatRoom};