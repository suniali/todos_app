const mongoose = require('mongoose');
const val = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('loadsh');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: { validator: val.isEmail }
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'I Love Amin').toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    console.log('Top of try Catch decoder');

    try {
        decoded = jwt.verify(token, 'I Love Amin');
        // console.log(decoded);

    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('users', userSchema);

module.exports = { User };