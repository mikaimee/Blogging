const Post = require('../models/Post')

const getAllPosts = async(req, res) => {
    const posts = await Post.find().lean()

    if (!posts?.length) {
        return res.status(400).json({message: 'No posts are found'})
    }

    res.json(posts)
}

const getOnePost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'Post ID required'})

    const post = await Post.findOne({_id: req.params.id}).exec()
    if (!post) {
        return res.status(204).json({'message': 'No post matches with provided ID'})
    }
    res.json(post)
}

// const getSinglePost = async (req, res) => {
//     if (!req?.params?.id) return res.status(400).json({'message': 'Post ID required'})

//     const post = await Post.findOne({_id: req?.parama?.id}).populate([
//         {
//             path: "user",
//             select: ["avatar", "username"]
//         },
//         {
//             path: "comments",
//             match: {
//                 check: true,
//                 parent: null
//             }, populate: [
//                 {
//                     path: "user",
//                     select: ["avatar", "username"]
//                 },
//                 {
//                     path: "replies",
//                     match: {
//                         check: true
//                     },
//                     populate: [
//                         {
//                             path: "user",
//                             select: ["avatar", "username"]
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]).exec()
//     if(!post) {
//         return res.status(204).json({message: 'Post not found'})
//     }
//     res.json(post)

// }

const createPost = async (req, res) => {
    const {user, title, summary, body} = req.body
    if (!user || !title || !summary || !body) {
        return res.status(400).json({message: 'All field are required'})
    }

    const post = await Post.create({
        user: req.user._id, 
        title, 
        summary, 
        body: {
            type: "doc", 
            content: []
        },
        photo: ""
    })
    if (post) {
        return res.status(201).json({message: 'Post is created'})
    }
    else {
        res.status(400).json({ message: 'Invalid post data received' })
    }
}

const updatePost = async(req, res) => {
    const {id, user, title, summary, body, tags, categories} = req.body
    if (!id || !user || !title || !summary|| !body) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const post = await Post.findById(req?.params?.id).exec()
    if (!post) {
        return res.status(400).json({message: 'Post is not found'})
    }

    post.user = user
    post.title = title
    post.body = body
    post.tags = tags
    post.categories = categories

    const updatedPost = await post.save()

    res.json({ message: `${updatedPost.title} updated` })
}

const deletePost = async (req, res) => {
    const {id} = req.body
    if (!id) {
        return res.status(400).json({ message: 'Post ID Required' })
    }

    const post = await Post.findById(req?.params?.id).exec()
    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const deletedPost = await post.deleteOne()

    res.json({message:`Post: ${deletedPost.title} with ID ${deletedPost._id} deleted`})
}

module.exports = {
    getAllPosts,
    // getSinglePost,
    getOnePost,
    createPost,
    updatePost,
    deletePost
}
