const mongoose = require('mongoose');
const val = require('validator');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate:{validator:val.isEmail}
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

module.exports = mongoose.model('users', userSchema);