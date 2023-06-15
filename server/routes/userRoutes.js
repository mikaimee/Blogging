const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.route('/')
    // .get(verifyRoles(ROLES_LIST.Admin), userController.allUsers)
    // .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser)
    .get(userController.allUsers)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)

router.route('/profile')
    .get(userController.oneUser)

module.exports = router