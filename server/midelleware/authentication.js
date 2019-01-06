var user = require('../models/user');

var authentication = (req, res, next) => {

    var token = req.header('x-auth');

    user.findByToken().then((user) => {
        if (!user) {
            return Promise.reject({ error: 'invalide authentication' });
        }

        res.user = user;
        res.toke = token;
        next();



    }).catch((e) => {

        return res.status(400).send({ error: e });
    });
}


module.export = {authentication};