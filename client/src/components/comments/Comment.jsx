import React from 'react'

const Comment = ({comment, loggedinUserId, affectedComment, setAffectedComment, addComment, parentId=null, updateComment, deleteComment, replies}) => {

    const isUserLoggedin = Boolean(loggedinUserId)
    const commentBelongsToUser = loggedinUserId === comment.user._id
    const isReplying = affectedComment && affectedComment.type === "editing" && affectedComment._id === comment._id
    const repliedCommentId = parentId ? parentId : comment._id
    const replyOnUserId = comment.user._id

    return (
        <div>
            {/* insert user avatar image */}
            <div>
                <h5>{comment.user.username}</h5>
                <span>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute:"2-digit"
                    })}
                </span>
                <p>
                    {comment.body}
                </p>
            </div>
        </div>
    )
}

export default Comment