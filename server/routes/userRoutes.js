const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const protection = require('../middleware/jwt')

router.route('/')
    .get(userController.allUsers  )
    .delete(userController.deleteUser)
    .patch(protection.authProtect, userController.updateProfile)

router.route('/profile')
    .get(protection.authProtect, userController.oneUser)

router.route('/profilePic')
    .patch(protection.authProtect, userController.updateProfilePic)

// router.route('/profilePic')
//     .put(userController.updateProfilePic)

module.exports = router