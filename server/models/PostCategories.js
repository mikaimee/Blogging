const mongoose = require('mongoose')

const PostCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true})

const PostCategories = model("PostCategories", PostCategoriesSchema)
export default PostCategories