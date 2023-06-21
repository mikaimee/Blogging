const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.route('/')
    .get(postController.getAllPosts)
    .post(postController.createPost)

router.route('/:id')
    .get(postController.getOnePost)
    // .get(postController.getSinglePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost)

router.route('/:id/like')
    .post(postController.likePost)

module.exports = router