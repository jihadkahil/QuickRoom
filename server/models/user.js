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

  UserSchema.statics.findByCredentials = function(email,password){
    
   var user = this;

   return user.findOne({email}).then((user)=>{
       if(!user)
       return Promise.reject({error:'user does not exist'});

      return new Promise((resolved,reject)=>{

        bcrypt.compare(password,user.password,(err,res)=>{
            console.log(err);
            if(err)
            reject({error:err})
            else if(res)
            resolved(user);
            else 
            reject({error:'email or password is not valide'});
        });
      }) ;
   });

  }


  UserSchema.methods.removeToken = function(token)
{

  
    var User = this;
    return User.update({
     $pull:{
        tokens:{
          token
        }
     }
    });
};

var User = mongoose.model('User',UserSchema);
module.exports = {User};