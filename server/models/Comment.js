const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // Tells if comment is the main comment or reply
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
}, {timestamps: true})

// Populated Virtual: contains documents from another collection
// Will populate documents from the model in ref whose FOREIGNFIELD matching the documet's LOCALFIELD
CommentSchema.virtual('replies', {
    ref: 'Comment',  // tells mongoose which model to populate documents from
    localField: "_id",
    foreignField: "parent"
})

module.exports = mongoose.model('Comment', CommentSchema)