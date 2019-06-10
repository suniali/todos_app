const { User } = require('../model/user');

var authenticate = (req, res, next) => {
    var token = req.header("jarvis-auth");
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.statusCoede=401;
        res.send();
    });
};

module.exports = { authenticate };

