const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const User = require('./../../model/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const testUser = [{
    _id: userOneID,
    email: 'ali@gmail.com',
    password: '123456Seven',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneID, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoID,
    email: 'ILoveAmin@gmail.com',
    password: 'Amin I Love you',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoID, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const removeUsers = (done) => {
    User.User.deleteMany({
        email: {
            $in: [testUser[0].email, testUser[1].email, "Aminali@gmail.com"]
        }
    })
        .then(() => done()).catch((err) => done(err));
};

const insertUsers = (done) => {
    User.User.insertMany(testUser).then(() => done()).catch((err) => done(err));
};

module.exports = { testUser, removeUsers, insertUsers, User };