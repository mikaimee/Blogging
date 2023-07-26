const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    // Indicates the user who created the comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Comment text
    body: {
        type: String,
        required: true
    },
    // Indicates the post to which the comment belongs
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // Tells if comment is the main comment or reply
    // If reply, will hold the ObjectId of the parent comment
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    // fetch data of user that replied to comment
    replyOnUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        default: null
    }
}, {timestamps: true, toJSON: {virtuals: true}})

// Populated Virtual: contains documents from another collection
// Will populate documents from the model in ref whose FOREIGNFIELD matching the documet's LOCALFIELD
CommentSchema.virtual('replies', {
    ref: 'Comment',  // tells mongoose which model to populate documents from
    localField: "_id",
    foreignField: "parent"
})

module.exports = mongoose.model('Comment', CommentSchema)