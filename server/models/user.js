const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:true,
      validate:{
        validator:validator.isEmail,
        message:'{VALUE} is not a valid email'
      }
    },
    password:{
      type:String,
      require:true,
      minlength:6
      
    },
    tokens:[{
      access:{
        type:String,
        required:true
      },
      token:{
        type:String,
        required:true
      }
    }]
  });


  UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);
  };

  
UserSchema.methods.generateAuthenticationToken = function()
{
    var user = this;
    var access = "QuickAuth"
    var token = jwt.sign({_id:user._id.toHexString(),access},process.env.QuickSecret).toString();

    user.tokens = user.tokens.concat({access, token});
    return user.save().then(()=>{
        return token;
    });
    

    //generate token;
    //save in DB

}

UserSchema.statics.findByToken = function(token) {
   
    var user = this;
    var decoded ;
    
  
    try{
        decoded = jwt.verify(token,process.env.QuickSecret);
    }catch(e)
    {
        return Promise.reject({error:'Invalide Session'});
    }
    
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'QuickAuth'
      });

}

UserSchema.pre('save',function (next){

    var user = this;
  
    if(user.isModified('password'))
    {
      bcrypt.genSalt(10,(err,salt)=>{
  
        bcrypt.hash(user.password,salt,(error,hash)=>{
        
        
          user.password = hash;
          next();
        });
    });
    }else
    {
      next();
    }
    
  });

var User = mongoose.model('User',UserSchema);
module.exports = {User};