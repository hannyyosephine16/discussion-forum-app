import { formatDateTime } from '../../utils/formatDate';
import VoteButton from '../votes/VoteButton';
import VoteCount from '../votes/VoteCount';

function CommentItem({ comment, threadId }) {
  return (
    <div className="comment-item">
      <div className="comment-votes">
        <VoteButton
          type="comment"
          itemId={comment.id}
          threadId={threadId}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          voteType="up"
        />
        <VoteCount 
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
        />
        <VoteButton
          type="comment"
          itemId={comment.id}
          threadId={threadId}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          voteType="down"
        />
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-author">
            <img 
              src={comment.owner?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
              alt={comment.owner?.name}
              className="author-avatar"
            />
            <div className="author-info">
              <span className="author-name">{comment.owner?.name}</span>
              <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="comment-body">
          <div dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br>') }} />
        </div>
      </div>
    </div>
  );
}

export default CommentItem;