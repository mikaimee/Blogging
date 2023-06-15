const Comment = require('../models/Comment')

const getAllComments = async(req, res) => {
    const comments = await Comment.find().lean()
    if (!comments?.length) {
        return res.status(400).json({message: 'No comments are foud'})
    }
    res.json(comments)
}

const createComment = async(req, res) => {
    const {user, post, body} = req.body
    if (!user || !post || !body) {
        return res.status(400).json({message: 'All field are required'})
    }

    const comment = await Comment.create({user, post, body})
    if (comment) {
        return res.status(201).json({message: 'Comment is created'})
    }
    else {
        res.status(400).json({ message: 'Invalid comment data received' })
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