const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        Blogger: {
            type: Number,
            default: 1658
        },
        Admin: Number
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('User', UserSchema)