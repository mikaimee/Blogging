const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
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
    }
}, {timestamps: true})

UserSchema.pre("save", async function (next) {
    // if password is modified
    if (!this.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getSigninToken = async function() {
    return await jwt.sign({_id: this._id}, SECRET_AT, {expiresIn: '1d'})
}


module.exports = mongoose.model('User', UserSchema)