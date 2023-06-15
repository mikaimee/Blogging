import {verify} from 'jsonwebtoken'
import User from '../models/User'
const SECRET_AT = process.env.ACCESS_TOKEN_ENV

export const verifyJWT = async (req, res, next) => {
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split (" ")[1]
            const {id} = verify(token, SECRET_AT)
            req.user = await User.findById(id).select("-password")
            next()
        }
        catch (error) {
            res.status(401).json({ message: 'Unauthorized, token failed' })
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized, No token' })
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401).json({message: 'Not authorized as admin'})
    }
}