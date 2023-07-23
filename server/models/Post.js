const mongoose = require('mongoose')

const likeSchmea = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

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
    // Slug is a unique identifier used to identigy a resource instead of less-readable identifier like id
    // use flug when wanting to refer to item while preserving abilty to see what the item is
    slug: {
        type: String,
        required: true,
        unique: true
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
    likes: [likeSchmea], // Array of objects representing likes
    likesCount: {
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

PostSchema.virtual('comments', {
    // ref tells Mongoose which model to populate documents from
    ref: 'Comment',
    // Populate documents from the model in ref whose foreignField matches this document's localField
    localField: '_id', // id of THIS post
    foreignField: 'postId' // localField must match id in postId property in Comment Model
})

module.exports = mongoose.model('Post', PostSchema)