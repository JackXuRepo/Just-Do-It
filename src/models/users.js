let mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    friendList: {
        type: Array,
        required: true
    },
    pendingList: {
        type: Array,
        required: true
    }
});

let User = module.exports = mongoose.model('User', userSchema)