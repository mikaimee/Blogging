const Comment = require('../models/Comment')
const Post = require('../models/Post')

const getAllComments = async(req, res) => {
    const comments = await Comment.find().lean()
    if (!comments?.length) {
        return res.status(400).json({message: 'No comments are foud'})
    }
    res.json(comments)
}

const createComment = async(req, res) => {
    try {
        const {body, slug, parent, replyOnUser} = req.body

        const post = await Post.findOne({slug: slug})
        if (!post) {
            res.status(404).json({message: 'Post does not exist'})
        }

        const newComment = new Comment({
            user: req.user._id,
            body,
            postId: post._id,
            parent,
            replyOnUser
        })
        const savedComment = await newComment.save()
        return res.json(savedComment)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const updateComment = async(req, res) => {
    const {id, body} = req.body
    if (!id || !body) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const comment = await Comment.findById(req?.params?.id).exec()
    if (!comment) {
        return res.status(400).json({message: 'Comment is not found'})
    }
    comment.body = body

    const updatedComment = await comment.save()

    res.json({ message: `Your comment with id of ${updatedComment.id} has been updated` })
}

const deleteComment = async (req, res) => {
    const {id} = req.body
    if (!id) {
        return res.status(400).json({ message: 'Comment ID Required' })
    }

    const comment = await Comment.findById(req?.params?.id).exec()
    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    const deletedComment = await comment.deleteOne()

    res.json({message:`Comment: ${deletedComment.title} with ID ${deletedComment._id} deleted`})
}

module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment
}