const jwt = require('jsonwebtoken')
const SECRET_AT = process.env.ACCESS_TOKEN_ENV

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.authorization

    if (!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        SECRET_AT,
        (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden' })
            req.user = decoded.UserInfo.username
            res.id = decoded.UserInfo.id
            req.roles = decoded.UserInfo.roles
            req.roles = decoded.UserInfo.isAdmin
            next()
        }
    )
}

module.exports = verifyJWT