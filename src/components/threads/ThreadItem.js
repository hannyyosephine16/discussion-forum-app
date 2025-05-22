// File: src/components/threads/ThreadItem.js
import { Link } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { formatDate } from '../../utils/formatDate';
import VoteButton from '../votes/VoteButton';
import VoteCount from '../votes/VoteCount';

// Memoized component untuk prevent unnecessary re-renders
const ThreadItem = memo(function ThreadItem({ thread, owner }) {
  // Memoize truncated body untuk avoid recalculation
  const truncatedBody = useMemo(() => {
    const maxLength = 150;
    if (thread.body.length <= maxLength) return thread.body;
    return `${thread.body.substring(0, maxLength)}...`;
  }, [thread.body]);

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    return formatDate(thread.createdAt);
  }, [thread.createdAt]);

  // Memoize owner info untuk avoid unnecessary renders
  const ownerInfo = useMemo(() => {
    if (!owner) return null;
    
    return {
      avatar: owner.avatar || 'https://ui-avatars.com/api/?name=User&background=random',
      name: owner.name
    };
  }, [owner]);

  return (
    <div 
      className="thread-item"
      aria-labelledby={`thread-title-${thread.id}`}
    >
      <div className="thread-votes" role="group" aria-label="Thread voting">
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
          <Link 
            to={`/thread/${thread.id}`} 
            className="thread-title"
            aria-describedby={`thread-meta-${thread.id}`}
          >
            <h3 id={`thread-title-${thread.id}`}>{thread.title}</h3>
          </Link>
          <span 
            className="thread-category"
            aria-label={`Category: ${thread.category}`}
          >
            {thread.category}
          </span>
        </div>
        
        <div className="thread-body" aria-label="Thread preview">
          <p>{truncatedBody}</p>
        </div>
        
        <div 
          id={`thread-meta-${thread.id}`}
          className="thread-meta"
          role="group"
          aria-label="Thread metadata"
        >
          <div className="thread-author">
            {ownerInfo && (
              <>
                <img 
                  src={ownerInfo.avatar}
                  alt={`Avatar of ${ownerInfo.name}`}
                  className="author-avatar"
                  loading="lazy"
                  width="24"
                  height="24"
                />
                <span className="author-name" aria-label={`Posted by ${ownerInfo.name}`}>
                  {ownerInfo.name}
                </span>
              </>
            )}
          </div>
          
          <div className="thread-stats" aria-label="Thread statistics">
            <time 
              className="thread-date" 
              dateTime={new Date(thread.createdAt).toISOString()}
              aria-label={`Posted ${formattedDate}`}
            >
              {formattedDate}
            </time>
            <span 
              className="thread-comments"
              aria-label={`${thread.totalComments} comments`}
            >
              {thread.totalComments} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Custom comparison function untuk React.memo
ThreadItem.displayName = 'ThreadItem';

export default ThreadItem;