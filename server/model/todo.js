const mongoose = require('mongoose');

var schema = mongoose.Schema({
    note: {
        type: String,
        require: true,
        trim: true,
        // default: null
    },
    pr: {
        type: String,
        require: false,
        trim: true,
        // default: null
    },
    age:{
        type:Number,
        require:true,
        // default:100
    },
    tell: {
        type: String,
        require: true,
        trim: true,
        minlength:11,
        maxlength:12,
    },
    description: {
        type: String,
        require: false,
        trim: true,
        // default: null
    }
});

module.exports = mongoose.model('todo', schema);

