const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_AT = process.env.ACCESS_TOKEN_SECRET
const SECRET_RT = process.env.REFRESH_TOKEN_SECRET

const registration = async (req, res) => {
    const {username, password, isAdmin} = req.body

    try {
            if (!username || !password) {
                return res.status(400).json({ message: 'All fields are required' })
            }

            const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
            if (duplicate) {
                return res.status(409).json({ message: 'User already exists' })
            }

            const newUser = await User.create({
                username,
                password,
                isAdmin
            })
            return res.status(201).json({
                _id: newUser._id,
                avatar: newUser.avatar,
                username: newUser.username,
                password: newUser.password,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: await newUser.getSigninToken(),
                message: `New user ${username} created` 
            })
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const login = async (req, res) => {
    const {username, password} = req.body
    
    if (!username || !password) {
        res.status(400).json({message: "All fields are required"})
    }

    try {
        const user = await User.findOne({username: username}).exec()
        if (!user) {
            res.status(404).json({message: "Invalid credentials"})
        }

        const validPassword = await user.matchPassword(password)
        if (!validPassword) {
            res.status(404).json({message: "Invalid credentials"})
        }

        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            username: user.username,
            password: user.password,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.getSigninToken(),
            message: `${username} is logged in!` 
        })
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

const refreshToken = async (req, res) => {
    const cookies = req.cookies
    // If cookies doesn't exist
    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt
    const loggingUser = await User.findOne({refreshToken}).exec()
    if(!loggingUser) return res.status(403).json({message: 'Forbidden'})

    jwt.verify(
        refreshToken,
        SECRET_RT,
        (err, decoded) => {
            if (err || loggingUser.username !== decoded.username) {
                return res.status(403).json({message: 'Forbidden'})
            }
            const accessToken = jwt.sign(
                {
                    id: loggingUser._id,
                    username: loggingUser.username
                },
                SECRET_AT,
                {expiresIn: '10s'}
            )
            res.json({loggingUser, accessToken})
        }
    )
}

const logout = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(204).json({message: "Not found"})

    const refreshToken = cookies.jwt
    const loggingUser = await User.findOne({refreshToken}).exec()
    if(!loggingUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
        return res.status(204)
    }

    // Delete refreshToken
    loggingUser.refreshToken = ''
    const result = await loggingUser.save()
    console.log(result)

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })
    res.status(204)
}

module.exports = {
    registration,
    login,
    refreshToken,
    logout
}