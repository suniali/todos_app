const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const User = require('./../../model/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const testUser = [{
    _id: userOneID,
    email: 'ali@gmail.com',
    password: '123456Seven',
    age: 22,
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneID, access: 'auth' }, 'I Love Amin').toString()
    }]
}, {
    _id: userTwoID,
    password: 'Amin I Love you',
    age: 37
}];

const removeUsers = (done) => {
    User.User.remove({}).then(() => done()).catch((err) => done(err));
};

const insertUsers = (done) => {
    User.User.insertMany(testUser).then(() => done()).catch((err) => done(err));
};

module.exports = { testUser, removeUsers, insertUsers };