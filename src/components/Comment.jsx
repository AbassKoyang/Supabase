
const Comment = ({comment, handleReplyButtonClick}) => {
  return (
    <div className="comments">
        <h3>@{comment.author.username}</h3>
        <small>{comment.author.email}</small>
        <p>{comment.comment_content}</p>
        <button onClick={handleReplyButtonClick}>Reply</button>
        <div className="replies">
                {comment.replies.map((reply) => <Comment comment={reply} />)}
        </div>
    </div>
  )
}

export default Comment