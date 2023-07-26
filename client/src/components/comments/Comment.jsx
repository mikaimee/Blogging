import React, {useState} from 'react'
import AddComment from './AddComment'

// receives several props, invluding 'comment' (the comment object), 'loggedInUserId' (ID of logged user), 'affectedComment' (currently affected comment), 
// setAffectedComment (function to update affected comment), 'addComment' (function to add new comment), 'updatedComment' (function to update comment),
// 'replies' (array of reply comments)
const Comment = ({comment, loggedInUserId, affectedComment, setAffectedComment, addComment, parentId = null, updateComment, deleteComment, replies, isDirectChild = false}) => {

    // See if user is logged in 
    const isUserLoggedIn = Boolean(loggedInUserId)
    // If the comment belongs to the logged user
    const commentBelongsToUser = loggedInUserId === comment.user._id
    // If comment is currently being edited or replied to based on the 'affectedComment' state
    const isReplying = affectedComment && affectedComment.type === "replying" && affectedComment._id === comment._id
    const isEditing = affectedComment && affectedComment.type === "editing" && affectedComment._id === comment._id
    const repliedCommentId = parentId ? parentId : comment._id
    const replyOnUserId  = comment.user._id

    const [visibleReplies, setVisibleReplies] = useState(2);
    
    const handleReplyButtonClick = () => {
        setAffectedComment({type: "replying", _id: comment._id})
    }

    const handleSeeMoreReplies = () => {
        setVisibleReplies((preVisibleReplies) => 
            Math.min(preVisibleReplies + 2, replies.length)
        )
    }

    const handleHideReplies = () => {
        setVisibleReplies(2) // Reset the number of visible replies
    }

    const visibleRepliesList = replies.slice(0, visibleReplies);
    const isMoreReplies = visibleReplies < replies.length;

    return (
        <div className="flex flex-nowrap items-start gap-x-3 bg-[#F2F4F5] p-3 rounded-lg">
            <div className="flex-1 flex flex-col">
                <h5 className="font-bold text-dark-hard text-xs lg:text-sm">
                    {comment.user.username}
                </h5>
                <span className="text-xs text-dark-light">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </span>
                {!isEditing && (
                    <p className="font-opensans mt-[10px] text-dark-light">
                        {comment.body}
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
                    {isUserLoggedIn && !isReplying && (
                        <button
                            className='flex items-center space-x-2'
                            onClick={handleReplyButtonClick}
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
                {isReplying && (
                    <AddComment
                        btnLabel="Reply"
                        formSubmitHandler={(value) => addComment(value, repliedCommentId, replyOnUserId)}
                        formCancelHandler={() => setAffectedComment(null)}
                    />
                )}
                {visibleRepliesList.length > 0 && (
                    <div>
                        {visibleRepliesList.map((reply) => (
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

                {isMoreReplies && (
                    <button onClick={handleSeeMoreReplies}>See more replies</button>
                )}

                {visibleReplies > 2 && (
                    <button onClick={handleHideReplies}>Hide replies</button>
                )}
            </div>
        </div>
    )
}


export default Comment