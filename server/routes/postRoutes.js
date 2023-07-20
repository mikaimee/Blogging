const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const protection = require('../middleware/jwt')

router.route('/')
    .get(postController.getAllPosts)
    .post(protection.authProtect, postController.createPost)

router.route('/:slug')
    .get(postController.getOnePost)
    .patch(protection.authProtect, postController.updatePost)
    .delete(protection.authProtect, postController.deletePost)

router.route('/:slug/photo')
    .patch(protection.authProtect, postController.updatePostPhoto)

router.route('/:slug/likes')
    .patch(protection.authProtect, postController.likePost)

router.route('/user/:userId/count')
    .get(protection.authProtect, postController.countPostByUser)

module.exports = router