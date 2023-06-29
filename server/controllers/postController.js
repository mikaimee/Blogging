const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { v4: uuid } = require('uuid')

const getAllPosts = async(req, res) => {
    try{
        const post = await Post.find({}).populate([
            {
                path: 'user',
                select: ['avatar', 'username']
            }
        ])
        res.json(post)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getOnePost = async (req, res) => {
    try{
        const post = await Post.findOne({slug: req.params.slug}).populate([
            // populate user data
            {path: 'user', select: ['avatar', 'username']},
            // retrieve comments 
            {
                path: 'comments',
                // will populate the comments array
                populate: [
                    {path: 'user', select: ['avatar', 'username']},
                    {path: 'replies',
                    populate: [
                        {
                            path: 'user', select: ['avatar', 'username']
                        }
                    ]
                    }
                ]
            }
        ])

        if (!post) {
            return res.status(400).json({message: 'No post found'})
        }
        return res.json(post)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const createPost = async (req, res) => {
    try {
        const post = new Post({
            title: "sample title",
            summary: "sample summary",
            body: {
                type: "doc",
                content: []
            },
            slug: uuid(),
            photo: "",
            user: req.user._id
        })
        const createdPost = await post.save()
        return res.json(createdPost)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({slug: req.params.slug})

        if (!post) {
            return res.status(404).json({message: 'Post was not found'})
        }

        post.title = req.body.title || post.title
        post.sumary = req.body.sumary || post.sumary
        post.body = req.body.body || post.body
        post.slug = req.body.slug || post.slug
        post.tags = req.body.tags || post.tags
        post.likes = req.body.likes || post.likes
        post.categories = req.body.categories || post.categories
        
        const updatedPost = await post.save()
        return res.json({
            updatedPost,
            message: `${updatedPost.title} updated`
        })

    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const deletePost = async (req, res) => {
    try{
        const post = await Post.findOneAndDelete({slug: req.params.slug})
        if (!post) {
            return res.status(404).json({message: "Post is not found"})
        }

        await Comment.deleteMany({postId: post._id})

        return res.json({
            message: "Post has been deleted"
        })
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const likePost = async(req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'Post ID required'})

    const post = await Post.findById(req?.params?.id)
    const addLikePost = await Post.findByIdAndUpdate(req?.params?.id, {
        likes: post.likes + 1
    }, {new: true})
    res.json(addLikePost)
}

module.exports = {
    getAllPosts,
    // getSinglePost,
    getOnePost,
    createPost,
    updatePost,
    deletePost,
    likePost
}
