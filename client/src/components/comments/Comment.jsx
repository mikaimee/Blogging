import React from 'react'
import AddComment from './AddComment'

const Comment = ({comment, loggedInUserId, affectedComment, setAffectedComment, addComment, parentId = null, updateComment, deleteComment, replies}) => {

    const isUserLoggedIn = Boolean(loggedInUserId)
    const commentBelongsToUser = loggedInUserId === comment.user._id
    const isReplying = affectedComment && affectedComment.type === "replying" && affectedComment._id === comment._id
    const isEditing = affectedComment && affectedComment.type === "editing" && affectedComment._id === comment._id
    const repliedCommentId = parentId ? parentId : comment._id
    const replyOnUserId  = comment.user._id

    return (
        <div className="flex flex-nowrap items-start gap-x-3 bg-[#F2F4F5] p-3 rounded-lg">
            <div className="flex-1 flex flex-col">
                <h5 className="font-bold text-dark-hard text-xs lg:text-sm">
                    {comment.user.username}
                    author
                </h5>
                <span className="text-xs text-dark-light">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                    Date
                </span>
                {!isEditing && (
                    <p className="font-opensans mt-[10px] text-dark-light">
                        {comment.body}
                        Comment Body
                    </p>
                )}
                {isEditing && (
                    <AddComment
                        btnLabel="Update"
                        formSubmitHandler={(value) => updateComment(value, comment._id)}
                        formCancelHandler={() => setAffectedComment(null)}
                        initialText={comment.body}
                    />
                )}
                <div className="flex items-center gap-x-3 text-dark-light font-roboto text-sm mt-3 mb-3">
                    {isUserLoggedIn && (
                        <button
                            className='flex items-center space-x-2'
                            onClick={() => setAffectedComment({type: "replying", _id: comment._id})}
                        >
                            <span>Reply</span>
                        </button>
                    )}
                    {commentBelongsToUser && (
                        <>
                            <button
                                className='flex items-center space-x-2'
                                onClick={() => setAffectedComment({type: "editing", _id: comment._id})}
                            >
                                <span>Edit</span>
                            </button>
                            <button
                                className='flex items-center space-x-2'
                                onClick={() => deleteComment(comment._id)}
                            >
                                <span>Delete</span>
                            </button>
                        </>
                    )}
                </div>
                {!isReplying && (
                    <AddComment
                        btnLabel="Reply"
                        formSubmitHandler={(value) => addComment(value, repliedCommentId, replyOnUserId)}
                        formCancelHandler={() => setAffectedComment(null)}
                    />
                )}
                {replies.length > 0 && (
                    <div>
                        {replies.map((reply) => (
                            <Comment
                                key={reply._id}
                                addComment={addComment}
                                affectedComment={affectedComment}
                                setAffectedComment={setAffectedComment}
                                comment={reply}
                                deleteComment={deleteComment}
                                loggedInUserId={loggedInUserId}
                                replies={[]}
                                updateComment={updateComment}
                                parentId={comment._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment