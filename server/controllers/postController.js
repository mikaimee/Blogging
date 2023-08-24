const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const { v4: uuid } = require('uuid')
const { uploadPic } = require('../middleware/uploadingPic')
const fileR = require('../config/fileRemover')

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
                        {path: 'user', select: ['avatar', 'username']}
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
            title: req.body.title,
            summary: req.body.summary,
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
        post.summary = req.body.summary || post.summary
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

const updatePostPhoto = async (req, res) => {
    try {
        uploadPic.single('postPicture')(req, res, async (err) => {
            if (err) {
                console.log(err.message)
                return
            }

            const slug = req.params.slug
            const updatedPost = await Post.findOneAndUpdate(
                { slug },
                { photo: req.file?.filename || ''},
                { new: true }
            )

            if (req.file) {
                try {
                    await fileR.fileRemover(updatedPost.photo)
                    console.log(`File removed: ${updatedPost.photo}`)
                }
                catch(error){
                    console.error(`Error removing file: ${updatedPost.photo}`, error);
                }
            }

            res.json({
                _id: updatedPost._id,
                title: updatedPost.title,
                summary: updatedPost.summary,
                body: updatedPost.body,
                slug: updatedPost.slug,
                photo: updatedPost.photo,
                likes: updatedPost.likes,
                tags: updatedPost.tags,
                categories: updatedPost.categories,
                message: `${updatedPost.username} avatar updated`
            })
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
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

const likePost = async (req, res) => {
    try {
        const userId = req.params.userId
        const post = await Post.findOne({slug: req.params.slug})
        if (!post) {
            return res.status(404).json({message: "Post is not found"})
        }

        // Check if the likes array exists and initialize it if needed
        if (!post.likes) {
            post.likes = []
        }

        // Check if the user's ID is already in the array of users who liked the post
        const existingLike = post.likes.find((like) => like.user.toString() === userId)
        if (existingLike) {
            return res.status(400).json({message: "You have already left a like"})
        }

        post.likes.push({user: userId}) // Add userId to the array
        post.likesCount += 1 // Increment likes 
        const updateLikesPost = await post.save()
        return res.status(200).json({
            updateLikesPost,
            message: "+1 Like"
        })
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const countPostByUser = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({messag: 'User is not found'})
        }
        const postCount = await Post.countDocuments({ user: userId })
        res.json({count: postCount})
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getAllPosts,
    // getSinglePost,
    getOnePost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    updatePostPhoto,
    countPostByUser
}
