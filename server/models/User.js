const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const SECRET_AT = process.env.ACCESS_TOKEN_SECRET

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ""
    },
    // refreshToken : {
    //     type: String
    // }
})

UserSchema.methods.getSigninToken = function() {
    return jwt.sign({id: this._id}, SECRET_AT, {expiresIn: '1d'})
}

module.exports = mongoose.model('User', UserSchema)