const jwt = require('jsonwebtoken')
const User = require('../models/User')
const SECRET_AT = process.env.ACCESS_TOKEN_ENV

exports.protect = async (req, res, next) => {
    // let token

    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    //     token = req.headers.authorization.split(" ")[1]
    // }

    // if(!token) {
    //     return res.status(401).json({message:'Not authorized to access'})
    // }

    // try {
    //     const decoded = jwt.verify(token, SECRET_AT)
    //     const user = await User.findById(decoded.id)
    //     if (!user) {
    //         return res.status(404).json({message: 'No user is found'})
    //     }
    //     req.user = user
    //     next()
    // } 
    // catch {
    //     return res.status(401).json({message: 'Not authorized to access'})
    // }
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const {id} = jwt.verify(token, SECRET_AT)
            req.user = await User.findById(id).select('-password')
            next()
        }
        catch (err) {
            res.status(401).json({message: "Token failed, not authorized"})
        }
    }
    else {
        res.status(401).json({message: 'No token, unauthorized'})
    }
}

// export const adminOnly = (req, res, next) => {
//     if (req.user && req.user.isAdmin) {
//         next()
//     }
//     else {
//         res.status(401).json({message: 'Not authorized as admin'})
//     }
// }