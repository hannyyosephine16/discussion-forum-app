import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { voteThread, voteComment, optimisticVoteThread, optimisticVoteComment } from '../../store/threadsSlice';
import useAuth from '../../hooks/useAuth';
import { VOTE_TYPES } from '../../utils/constants';
import Modal from '../common/Modal';

function VoteButton({ 
  type, // 'thread' or 'comment'
  itemId, 
  threadId, 
  upVotesBy = [], 
  downVotesBy = [], 
  voteType // 'up', 'down', or 'neutral'
}) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleVote = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (isVoting) return; // Prevent double clicks

    const userId = user.id;
    let newVoteType;

    // Determine new vote type
    if (voteType === 'up') {
      newVoteType = upVotesBy.includes(userId) ? VOTE_TYPES.NEUTRAL : VOTE_TYPES.UP;
    } else if (voteType === 'down') {
      newVoteType = downVotesBy.includes(userId) ? VOTE_TYPES.NEUTRAL : VOTE_TYPES.DOWN;
    }

    try {
      setIsVoting(true);
      
      // Apply optimistic update first
      if (type === 'thread') {
        dispatch(optimisticVoteThread({ threadId: itemId, voteType: newVoteType, userId }));
        await dispatch(voteThread({ threadId: itemId, voteType: newVoteType }));
      } else if (type === 'comment') {
        dispatch(optimisticVoteComment({ commentId: itemId, voteType: newVoteType, userId }));
        await dispatch(voteComment({ threadId, commentId: itemId, voteType: newVoteType }));
      }
    } catch (error) {
      console.error('Vote error:', error);
      // Error is handled by Redux with rollback
    } finally {
      setIsVoting(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    // Focus management for screen readers
    const loginLink = document.querySelector('a[href="/login"]');
    if (loginLink) {
      loginLink.click();
    }
  };

  const isUpvoted = user && upVotesBy.includes(user.id);
  const isDownvoted = user && downVotesBy.includes(user.id);

  const getButtonClass = () => {
    let baseClass = 'vote-btn';
    
    if (voteType === 'up') {
      baseClass += isUpvoted ? ' vote-btn-active' : ' vote-btn-up';
    } else if (voteType === 'down') {
      baseClass += isDownvoted ? ' vote-btn-active' : ' vote-btn-down';
    }
    
    if (isVoting) {
      baseClass += ' vote-btn-loading';
    }
    
    return baseClass;
  };

  const getAriaLabel = () => {
    const action = voteType === 'up' ? 'upvote' : 'downvote';
    const currentState = (voteType === 'up' && isUpvoted) || (voteType === 'down' && isDownvoted);
    const actionText = currentState ? 'Remove your' : 'Add';
    const itemType = type === 'thread' ? 'thread' : 'comment';
    
    return `${actionText} ${action} for this ${itemType}`;
  };

  const getAriaPressed = () => {
    return (voteType === 'up' && isUpvoted) || (voteType === 'down' && isDownvoted);
  };

  const getTitle = () => {
    const action = voteType === 'up' ? 'Upvote' : 'Downvote';
    const itemType = type === 'thread' ? 'thread' : 'comment';
    return `${action} this ${itemType}`;
  };

  const getButtonContent = () => {
    if (isVoting) {
      return <span className="vote-loading" aria-hidden="true">⏳</span>;
    }
    
    if (voteType === 'up') {
      return <span aria-hidden="true">👍</span>;
    }
    if (voteType === 'down') {
      return <span aria-hidden="true">👎</span>;
    }
    return '';
  };

  const getStatusText = () => {
    if (isVoting) return 'Processing vote...';
    if ((voteType === 'up' && isUpvoted) || (voteType === 'down' && isDownvoted)) {
      return `You have ${voteType}voted this ${type}`;
    }
    return '';
  };

  return (
    <>
      <button
        type="button"
        className={getButtonClass()}
        onClick={handleVote}
        disabled={isVoting}
        aria-label={getAriaLabel()}
        aria-pressed={getAriaPressed()}
        aria-describedby={`vote-status-${type}-${itemId}-${voteType}`}
        title={getTitle()}
      >
        {getButtonContent()}
      </button>
      
      {/* Screen reader status text */}
      <span 
        id={`vote-status-${type}-${itemId}-${voteType}`}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {getStatusText()}
      </span>

      {/* Login Required Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        type="warning"
        title="Login Required"
        confirmText="Go to Login"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleLoginRedirect}
      >
        <p>You need to be logged in to vote on posts and comments.</p>
        <p>Would you like to go to the login page now?</p>
      </Modal>
    </>
  );
}

export default VoteButton;