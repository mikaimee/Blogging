import Comment from "./Comment"
import AddComment from "./AddComment"
import {newComment, editComment, deleteComment} from '../../services/comments'
import { useState } from "react"
import { useSelector } from "react-redux"
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

const CommentBox = ({className, loggedInUserId, comments, postSlug}) => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const userState = useSelector((state) => state.user)
    const [affectedComment, setAffectedComment] = useState(null)
    const [visibleComments, setVisibleComments] = useState(2)

    const {mutate: mutateNewComment, isLoading: isLoadingNewComment} = useMutation({
        mutationFn: ({token, body, slug, parent, replyOnUser}) => {
            return newComment({token, body, slug, parent, replyOnUser})
        },
        onSuccess: () => {
            toast.success("Comment successful")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const {mutate: mutateUpdateComment, isLoading: isLoadingUpdateComment} = useMutation({
        mutationFn: ({token, body, commentId}) => {
            return editComment({token, body, commentId})
        },
        onSuccess: () => {
            toast.success("Comment successful update")
            queryClient.invalidateQueries(["blog", postSlug])
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const {mutate: mutateDeleteComment, isLoading: isLoadingDeleteComment} = useMutation({
        mutationFn: ({token, commentId}) => {
            return deleteComment({token, commentId})
        },
        onSuccess: () => {
            toast.success("Comment delete successful")
            queryClient.invalidateQueries(["blog", postSlug])
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const addCommentHandler = (value, parent = null, replyOnUser = null) => {
        if (!loggedInUserId) {
            toast.error("Please login or register to commet")
            navigate("/login")
            return
        }

        mutateNewComment({
            body: value,
            parent, 
            replyOnUser,
            token: userState.userInfo.token,
            slug: postSlug
        })
        setAffectedComment(null)
    }


    const updateCommentHandler = (value, commentId) => {
        mutateUpdateComment({
            token: userState.userInfo.token,
            body: value,
            commentId
        })
        setAffectedComment(null)
    }

    const deleteCommentHandler = (commentId) => {
        mutateDeleteComment({
            token: userState.userInfo.token,
            commentId
        })
    }

    const handleFormCancel = () => {
        console.log("Form canceled")
    }

    const handleSeeMoreComments = () => {
        setVisibleComments((prevVisibleComments) => 
            Math.min(prevVisibleComments + 2, comments.length)
        )
    };

    // Checks if 'comments' prop is defined and an array before using slice
    const visibleCommentsList =
    Array.isArray(comments) && comments.slice(0, visibleComments);


    return (
        <div className={`${className}`}>
            <AddComment 
                btnLabel = "Comment"
                formSubmitHandler={(value) => addCommentHandler(value)}
                formCancelHandler={handleFormCancel}
                loading= {isLoadingNewComment}
            />
            <div className="space-y-4 mt-8">
                {/* comments && comments.map() ensures that the comments array exists 
                and is not 'null' or 'undefined' before attempting to map over it */}
                {Array.isArray(visibleCommentsList) && visibleCommentsList.map((comment) => (
                    <Comment 
                        key={comment._id}
                        comment={comment}
                        loggedInUserId={loggedInUserId}
                        affectedComment={affectedComment}
                        setAffectedComment = {setAffectedComment}
                        addComment = {addCommentHandler}
                        updateComment = {updateCommentHandler}
                        deleteComment = {deleteCommentHandler}
                        replies={comment.replies}
                        isDirectChild={false}
                    />
                ))}
            </div>

            {Array.isArray(comments) && comments.length > visibleComments && (
                <button onClick={handleSeeMoreComments}>See more comments</button>
            )}
            {visibleComments > 2 && (
                <button onClick={() => setVisibleComments(2)}>Hide comments</button>
            )}
        </div>
    )
}

export default CommentBox