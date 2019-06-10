const express = require('express');
const { User } = require('../model/user');
const _ = require('loadsh');
const {authenticate} = require('../middlewarer/authenticate');

const userRoutes = express.Router();

userRoutes.post('/user', async (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    try {
        var saveUser = await user.save();
        var token = await user.generateAuthToken();
        res.header('jarvis-auth', token).send(saveUser);
    } catch (e) {
        res.statusCode = 500;
        res.json({ 'err_msg': 'Can not SignUp user!' });
    }
});

userRoutes.get('/user/me', authenticate ,(req, res) => {
    res.send(req.user);
});



module.exports = userRoutes;