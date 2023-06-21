const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    body: {
        type: Object,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String]
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostCategories'
    }]
}, {timestamps: true, toJSON: {virtuals: true}})

module.exports = mongoose.model('Post', PostSchema)