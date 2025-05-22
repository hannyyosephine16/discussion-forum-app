import CommentItem from './CommentItem';

function CommentsList({ comments, threadId }) {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          threadId={threadId}
        />
      ))}
    </div>
  );
}

export default CommentsList;