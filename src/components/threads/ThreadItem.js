import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import VoteButton from '../votes/VoteButton';
import VoteCount from '../votes/VoteCount';

function ThreadItem({ thread, owner }) {
  const truncateBody = (body, maxLength = 150) => {
    if (body.length <= maxLength) return body;
    return `${body.substring(0, maxLength)}...`;
  };

  return (
    <article className="thread-item">
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
      
      <div className="thread-content">
        <div className="thread-header">
          <Link to={`/thread/${thread.id}`} className="thread-title">
            <h3>{thread.title}</h3>
          </Link>
          <span className="thread-category">{thread.category}</span>
        </div>
        
        <div className="thread-body">
          <p>{truncateBody(thread.body)}</p>
        </div>
        
        <div className="thread-meta">
          <div className="thread-author">
            {owner && (
              <>
                <img 
                  src={owner.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
                  alt={owner.name}
                  className="author-avatar"
                />
                <span className="author-name">{owner.name}</span>
              </>
            )}
          </div>
          
          <div className="thread-stats">
            <span className="thread-date">{formatDate(thread.createdAt)}</span>
            <span className="thread-comments">{thread.totalComments} comments</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ThreadItem;