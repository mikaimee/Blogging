const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const protection = require('../middleware/jwt')

router.route('/')
    .get(commentController.getAllComments)
    .post(protection.authProtect, commentController.createComment)

router.route('/:id')
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment)

module.exports = router