import Comment from "./Comment"
import AddComment from "./AddComment"
import {newComment, editComment, deleteComment} from '../../services/comments'
import { useState } from "react"
import { useSelector } from "react-redux"
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

const CommentBox = ({className, loggedInUserId, comments, postSlug}) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [affectedComment, setAffectedComment] = useState(null)

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
            return newComment({token, body, commentId})
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
            return newComment({token, commentId})
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

    return (
        <div className={`${className}`}>
            <p>Add Comment Box HERE</p>
            <AddComment 
                btnLabel = "Send"
                formSubmitHandler = {(value) => addCommentHandler(value)}
                loading= {isLoadingNewComment}
            />
            <div className="space-y-4 mt-8">
                <p>Mapping all comments OF POST here</p>
                <p>The problem now is that when everything is refreshed, the comment mapping has an error</p>
                {/* {comments.map((comment) => (
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
                    />
                ))} */}
            </div>
        </div>
    )
}

export default CommentBox