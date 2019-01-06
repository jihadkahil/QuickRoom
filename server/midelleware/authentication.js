var {User} = require('./../models/user');

var authentication = (req, res, next) => {

    var token = req.header('x-auth');

    User.findByToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzMyNTVhMmQ4NDMzMjBjM2NkN2YyMjkiLCJhY2Nlc3MiOiJRdWlja0F1dGgiLCJpYXQiOjE1NDY4MDI1OTR9.7KimM0PbgBLCTFUxIOLIDz2TuFeIsySCqMUUdVAGS-4')
    .then((user)=>{
        res.send(user);
    }).catch((e)=>{
        console.log(e);
    })
    User.findByToken(token).then((user) => {
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


module.exports = {authentication}