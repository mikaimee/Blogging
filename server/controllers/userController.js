const User = require('../models/User')
const bcrypt = require('bcrypt')
// const uP = require('../middleware/uploadingPic')
// const fileR = require('../config/fileRemover')

const allUsers = async (req, res) => {
    const users = await User.find()
    if(!users) returnres.status(204).json({message: 'No users found'})
    res.json(users)
}

const oneUser = async(req, res) => {
    // const {id} = req.body
    // if (!id) {
    //     return res.status(400).json({message: 'User ID is required'})
    // }
    const user = await User.findById(req.body._id).exec()
    if(!user) {
        return res.status(204).json({message: `User with id of ${req.params.id} is not found`})
    }
    res.json({
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        password: user.password,
        email: user.email,
        isAdmin: user.isAdmin
    })
}

const updateUser = async (req, res) => {
    const { _id, username, isAdmin, password, avatar, email} = req.body

    // Confirm data 
    if (!_id || !username) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    user.username = username
    user.email = email
    user.avatar = avatar
    user.isAdmin = isAdmin
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ 
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
        username: updatedUser.username,
        password: updatedUser.password,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: await updatedUser.getSigninToken(),
        message: `${updatedUser.username} updated` 
    })
}

// const updateProfilePic = async(req, res) => {
//     try{
//         const upload = uploadPicture.uploadPic.single('profilePicture')

//         upload(req, res, async function (err) {
//             if (err) {
//                 console.log(err.message)
//             }
//             else {
//                 if (req.file) {
//                     const updatedUser = await User.findByIdAndUpdate(req.user._id, {
//                         avatar: req.file.filename
//                     }, {new: true})
//                     res.json({
//                         _id: updatedUser._id,
//                         avatar: updatedUser.avatar,
//                         username: updatedUser.username,
//                         password: updatedUser.password,
//                         email: updatedUser.email,
//                         isAdmin: updatedUser.isAdmin,
//                         token: await updatedUser.getSigninToken(),
//                         message: `${updatedUser.username} updated` 
//                     })
//                 }
//                 else {
//                     let filename
//                     let updatedUser = await User.findById(req.user._id)
//                     filename = updatedUser.avatar
//                     updateUser.avatar = "" // if there's no file, reset
//                     await updatedUser.save()
//                     fileR.fileRemover(filename)
//                     res.json({
//                         _id: updatedUser._id,
//                         avatar: updatedUser.avatar,
//                         username: updatedUser.username,
//                         password: updatedUser.password,
//                         email: updatedUser.email,
//                         isAdmin: updatedUser.isAdmin,
//                         token: await updatedUser.getSigninToken(),
//                         message: `${updatedUser.username} updated`
//                     })
//                 }
//             }
//         })
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

const deleteUser = async (req, res) => {
    if (!req?.body?._id) {
        return res.status(400).json({message: 'User ID is required'})
    }
    const user = await User.findOne({_id: req.body._id}).exec()
    if (!user) {
        return res.status(204).json({message: `User with ID of ${req.body._id} is not found`})
    }
    const result = await user.deleteOne({_id: req.body._id})
    res.json(result)
}

module.exports = {
    allUsers,
    oneUser,
    updateUser,
    // updateProfilePic,
    deleteUser
}