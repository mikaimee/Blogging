const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_AT = process.env.ACCESS_TOKEN_SECRET
const SECRET_RT = process.env.REFRESH_TOKEN_SECRET

const register = async(req, res) => {
    const { username, password, roles, isAdmin } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    try {
        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        // If don't have array of roles or if array but doesn't have length, use username + password
        // If not, use username, password, roles
        const newUser = (!Array.isArray(roles) || !roles.length)
        ? {username, "password": hashedPassword, isAdmin}
        : {username, "password": hashedPassword, roles, isAdmin}

        // Create and store new user 
        const user = await User.create(newUser)
        if (user) { // is created 

            // Create an accessToken
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                SECRET_AT,
                { expiresIn: '15m' }
            )
        
            const refreshToken = jwt.sign(
                {username: user.username},
                SECRET_RT,
                {expiresIn: '1d'}
            )
        
            user.refreshToken = refreshToken
            const result = await user.save()
            console.log(result)
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(201).json({ 
                _id: user._id,
                avatar: user.avatar,
                username: user.username,
                password: user.password,
                email: user.email,
                isAdmin: user.isAdmin,
                token: accessToken,
                message: `New user ${username} created` 
            })
        } else {
            res.status(400).json({ message: 'Invalid user data received' })
        }
    }
    catch(err) {
        console.log(err)
        res.status(400).json(err)
    }

}

const login = async (req, res) => {
    const {username, password} = req.body

    // If no username or password is entered
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const loggingUser = await User.findOne({username: username}).exec()
    
    // If the loggingUser doesn't exist
    if (!loggingUser) return res.status(401).json({message: 'User Not found'})
    
    // If the passwod matches with input
    const match = await bcrypt.compare(password, loggingUser.password)
    if(!match) return res.status(401).json({message: 'Invalid input'})

    const accessToken = jwt.sign(
        {
            id: loggingUser._id,
            username: loggingUser.username
        },
        SECRET_AT,
        { expiresIn: '10s' }
    )

    const refreshToken = jwt.sign(
        {"username": loggingUser.username},
        SECRET_RT,
        {expiresIn: '1d'}
    )

    loggingUser.refreshToken = refreshToken
    const result = await loggingUser.save()
    console.log(result)
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }) 

    res.status(201).json({
        _id: result._id,
        avatar: result.avatar,
        username: result.username,
        password: result.password,
        email: result.email,
        isAdmin: result.isAdmin,
        token: accessToken,
        message: 'You are logged in!'
    })
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
    register,
    login,
    refreshToken,
    logout
}