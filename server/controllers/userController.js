const { uploadPic } = require('../middleware/uploadingPic')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const uP = require('../middleware/uploadingPic')
const fileR = require('../config/fileRemover')

const allUsers = async (req, res) => {
    const users = await User.find()
    if(!users) returnres.status(204).json({message: 'No users found'})
    res.json(users)
}

const oneUser = async(req, res) => {
    // const {_id} = req.body
    // if (!_id) {
    //     return res.status(400).json({message: 'User ID is required'})
    // }
    // const user = await User.findById(req.body._id).exec()
    // if(!user) {
    //     return res.status(204).json({message: `User with id of ${req.body._id} is not found`})
    // }
    // res.status(201).json({
    //     _id: user._id,
    //     avatar: user.avatar,
    //     username: user.username,
    //     password: user.password,
    //     email: user.email,
    //     isAdmin: user.isAdmin
    // })
    try {
        let user = await User.findById(req.user._id);
    
        if (user) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } 
        else {
            return res.status(401).json("User is not found")
        }
    } 
    catch (error) {
        console.log(error);
    }
}

// const updateUser = async (req, res) => {
//     const { _id, username, isAdmin, password, avatar, email} = req.body

//     // Confirm data 
//     if (!_id || !username) {
//         return res.status(400).json({ message: 'All fields except password are required' })
//     }

//     // Does the user exist to update?
//     const user = await User.findById(_id).exec()
//     if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//     }

//     // Check for duplicate 
//     const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
//     // Allow updates to the original user 
//     if (duplicate && duplicate?._id.toString() !== _id) {
//         return res.status(409).json({ message: 'Duplicate username' })
//     }
//     user.username = username
//     user.email = email
//     user.avatar = avatar
//     user.isAdmin = isAdmin
//     if (password) {
//         // Hash password 
//         user.password = await bcrypt.hash(password, 10) // salt rounds 
//     }

//     const updatedUser = await user.save()

//     res.json({ 
//         _id: updatedUser._id,
//         avatar: updatedUser.avatar,
//         username: updatedUser.username,
//         password: updatedUser.password,
//         email: updatedUser.email,
//         isAdmin: updatedUser.isAdmin,
//         token: await updatedUser.getSigninToken(),
//         message: `${updatedUser.username} updated` 
//     })
// }

const updateProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id)
        if (!user) {
            return res.staus(404).json({message: 'User not found'})
        }

        user.username = req.body.username || user.username
        user.password = req.body.password

        const updatedProfile = await user.save()
        res.json({
            _id: updatedProfile._id,
            avatar: updatedProfile.avatar,
            username: updatedProfile.username,
            password: updatedProfile.password,
            email: updatedProfile.email,
            isAdmin: updatedProfile.isAdmin,
            token: await updatedProfile.getSigninToken(),
            message: `${updatedProfile.username} updated`
        })
    }
    catch (err) {
        console.log(err)
    }
}

const updateProfilePic = async (req, res) => {
    try {
        // single('profilePicture') used to handle the file upload which is invoked by bassing the req and res objects as arguments, along with error-first callback function
        uploadPic.single('profilePicture')(req, res, async (err) => {
            // err parameter is checked to determine if an error occured dueing the upload process
            // if present, it is logged and function returns early
            if (err) {
                console.log(err.message)
                return
            }

            // If no error
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { avatar: req.file?.filename || ''},
                { new: true }
            )

            // Checks if 'req.file' exists, indicating that new file was uploaded
            // If exists, code attempts the removal of previous avatar file
            if (req.file) {
                try {
                    await fileR.fileRemover(updatedUser.avatar)
                    console.log(`File removed: ${updatedUser.avatar}`)
                }
                catch(error){
                    console.error(`Error removing file: ${updatedUser.avatar}`, error);
                }
            }

            // JSON response is sent back to the client, containing the updated user's information with the new avatar filename
            res.json({
                _id: updatedUser._id,
                avatar: updatedUser.avatar,
                username: updatedUser.username,
                password: updatedUser.password,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: await updatedUser.getSigninToken(),
                message: `${updatedUser.username} avatar updated`
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}

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
    updateProfile,
    updateProfilePic,
    deleteUser
}