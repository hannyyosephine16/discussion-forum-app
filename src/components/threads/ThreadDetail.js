import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatDate';
import VoteButton from '../votes/VoteButton';
import VoteCount from '../votes/VoteCount';
import CommentsList from '../comments/CommentsList';
import CommentForm from '../comments/CommentForm';
import useAuth from '../../hooks/useAuth';

function ThreadDetail({ thread }) {
  const { isAuthenticated } = useAuth();

  if (!thread) {
    return <div className="loading">Loading thread...</div>;
  }

  console.log('ThreadDetail rendered:', { thread, isAuthenticated }); // Debug

  return (
    <article className="thread-detail">
      <div className="thread-header">
        <div className="thread-votes">
          <VoteButton
            type="thread"
            itemId={thread.id}
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            voteType="up"
          />
          <VoteCount 
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
          />
          <VoteButton
            type="thread"
            itemId={thread.id}
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            voteType="down"
          />
        </div>
        
        <div className="thread-info">
          <h1 className="thread-title">{thread.title}</h1>
          <span className="thread-category">{thread.category}</span>
          
          <div className="thread-meta">
            <div className="thread-author">
              <img 
                src={thread.owner?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
                alt={thread.owner?.name}
                className="author-avatar"
              />
              <div className="author-info">
                <span className="author-name">{thread.owner?.name}</span>
                <span className="thread-date">{formatDateTime(thread.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="thread-body">
        <div dangerouslySetInnerHTML={{ __html: thread.body.replace(/\n/g, '<br>') }} />
      </div>
      
      <div className="comments-section">
        <h2>Comments ({thread.comments?.length || 0})</h2>
        
        {/* Comment Form - Show for authenticated users */}
        {isAuthenticated ? (
          <CommentForm threadId={thread.id} />
        ) : (
          <div className="auth-prompt">
            <p>
              Please <Link to="/login">login</Link> to join the discussion and add comments.
            </p>
          </div>
        )}
        
        {/* Comments List */}
        {thread.comments && thread.comments.length > 0 ? (
          <CommentsList comments={thread.comments} threadId={thread.id} />
        ) : (
          <div className="no-comments">
            <p>No comments yet. {isAuthenticated ? 'Be the first to comment!' : 'Login to be the first to comment!'}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default ThreadDetail;