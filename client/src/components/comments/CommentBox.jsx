import Comment from "./Comment"
import AddComment from "./AddComment"

const CommentBox = ({loggedinUserId, comments}) => {
    return (
        <div>
            <AddComment
            />
            {comments.map((comment) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    loggedinUserId = {loggedinUserId}
                    replies = {comment.replies}
                />
            ))}
        </div>
    )
}

export default CommentBox