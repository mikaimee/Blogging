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

router.route('/:slug/like')
    .post(postController.likePost)

module.exports = router