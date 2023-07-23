import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAllPosts, getSinglePost, deletePost, updatePostLike } from '../services/posts'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import CommentBox from '../components/comments/CommentBox'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

import { generateHTML } from '@tiptap/html'
import Bold from '@tiptap/extension-bold'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Italic from '@tiptap/extension-italic'
import Document from "@tiptap/extension-document";

const SinglePost = () => {

    const {slug} = useParams()
    const userState = useSelector((state) =>state.user)
    const [body, setBody] = useState(null)
    const [likes, setLikes] = useState([]);
    const [likesCount, setLikesCount] = useState(0)
    const [isLoadingLikes, setIsLoadingLikes] = useState(false)
    // get QueryClient from the context
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {data, isLoading, isError} = useQuery({
        queryFn: () => getSinglePost({slug}),
        queryKey: ["blog", slug],
        onSuccess: (data) => {
            console.log(data)
            setBody(
                parse(
                    generateHTML(data?.body, [
                        Bold,
                        Italic,
                        Text,
                        Paragraph,
                        Document
                    ])
                )
            )
        }
    })

    const {mutate: mutateDeletePost, isLoading: isLoadingDeletePost} = useMutation({
        mutationFn: ({slug, token}) => {
            return deletePost({slug, token})
        },
        onSuccess: (data) => {
            console.log(data)
            // marks queries as stale and potentially refetch
            queryClient.invalidateQueries(["posts"])
            toast.success("Successfully deleted post")
            navigate("/")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const deleteHandler = ({slug, token}) => {
        mutateDeletePost({slug, token})
    }

    const mutateUpdateLikes = useMutation(
        (data) => updatePostLike({ 
            ...data, 
            userId: userState.userInfo?._id, 
            likes: likes ?? [], 
            likesCount: likesCount ?? 0, 
            token: userState.userInfo?.token, 
            slug
        }), // Pass both the likes array and likesCount
        {
            onSuccess: (data) => {
                setLikes(data.likes);
                setLikesCount(data.likesCount);
            },
            onError: (error) => {
                toast.error(error.message);
                console.log(error);
            },
        }
    );

    const handleLikes = () => {
        if (!userState.userInfo) {
            navigate('/login')
            return
        }
        const userId = userState.userInfo._id;
        // Check if the logged-in user has already liked the post
        const userHasLiked = likes && likes.includes(userId);
        if (userHasLiked) {
            toast.error("You have already liked this post.");
            return;
        }
        // Pass the userId to the mutation function
        mutateUpdateLikes.mutate({userId});
    };

    return (
        <Layout>
            <div className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
                {/* <div>
                    {data?.categories.map((category) => (
                        <Link to={`blog/category=${category.name}`}>
                            {category.name}
                        </Link>
                    ))}
                </div> */}
                <div>
                    {/* Only person who made the post or admin can delete post */}
                    {data?.user?._id === userState.userInfo?._id || userState.userInfo?.isAdmin ? (
                        <button
                        type='button'
                        onClick={() => {
                            deleteHandler({slug: data?.slug, token: userState.userInfo.token})
                        }}
                    >
                        Delete
                    </button>
                    ): null}
                </div>
                <div>
                    <h1 className="text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">{data?.title}</h1>
                    <div>
                        <span>
                            {data?.likesCount !== undefined ? `${data?.likesCount} ${data?.likesCount === 1 ? 'like' : 'likes'}` : 'Loading likes...'}
                        </span>
                        <button
                            onClick={handleLikes}
                            disabled={mutateUpdateLikes.isLoading}
                        >
                            {mutateUpdateLikes.isLoading ? 'Loading...' : 'Add a Like'}
                        </button>
                    </div>
                    
                    <div className="mt-4 prose prose-sm sm:prose-base">
                        {body}
                    </div>
                    <CommentBox 
                        comments = {data?.comments}
                        className="mt-10"
                        loggedInUserId = {userState?.userInfo?._id}
                        postSlug = {slug}
                    />
                    <Link to="/">
                            <p>Go back home</p>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default SinglePost