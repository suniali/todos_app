const express = require('express');
const User = require('../model/user');
const _ = require('loadsh');

const userRoutes = express.Router();

userRoutes.post('/user', async (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    try {
        var saveUser = await user.save();
        res.json(saveUser);
    } catch (e) {
        res.statusCode = 500;
        res.json({ 'err_msg': 'Can not SignUp user!' });
    }
});



module.exports = userRoutes;