var {User} = require('./../models/user');

var authentication = (req, res, next) => {

    var token = req.header('x-auth');

  
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject({ error: 'invalide authentication' });
        }

    
        req.user = user;
        req.token = token;
        next();



    }).catch((e) => {

        return res.status(400).send({ error: e });
    });
}


module.exports = {authentication}