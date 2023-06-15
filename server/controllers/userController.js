const User = require('../models/User')
const bcrypt = require('bcrypt')
// import {uploadPicture} from '../middleware/uploadingPic'
// import { fileRemover } from "../config/fileRemover"

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
    const { id, username, roles, password, avatar, email} = req.body

    // Confirm data 
    if (!id || !username) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    user.username = username
    user.email = email
    user.avatar = avatar
    user.roles = roles
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

// const updateProfilePic = async(req, res) => {
//     try {
//         const upload = uploadPicture.single("profilePicture")

//         upload(req, res, async function (err) {
//             if (err) {
//                 res.json({message: 'Unknown error occured'})
//                 console.log(err.message)
//             }
//             else {
//                 // if everything works well
//                 if (req.file) {
//                     let filename
//                     let updatedUser = await User.findById(req.user._id).exec()
//                     filename = updatedUser.avatar
//                     // Delete the old profile pic
//                     if (filename) {
//                         fileRemover(filename)
//                     }
//                     // Update to new file
//                     updatedUser.avatar = req.file.filename
//                     await updatedUser.save()
//                     res.json({ message: 'user avatar is updated' })
//                 }
//                 else {
//                     let filename
//                     let updatedUser = await User.findById(req.user._id).exec()
//                     filename = updatedUser.avatar
//                     updatedUser.avatar = ""
//                     await updatedUser.save()
//                     fileRemover(filename)
//                     res.json({ message: 'user avatar is updated' })
//                 }
//             }
//         })
//     }
//     catch (err) {
//         console.error(err)
//     }
// }

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({message: 'User ID is required'})
    }
    const user = await User.findOne({_id: req.body.id}).exec()
    if (!user) {
        return res.status(204).json({message: `User with ID of ${req.body.id} is not found`})
    }
    const result = await user.deleteOne({_id: req.body.id})
    res.json(result)
}

module.exports = {
    allUsers,
    oneUser,
    updateUser,
    // updateProfilePic,
    deleteUser
}