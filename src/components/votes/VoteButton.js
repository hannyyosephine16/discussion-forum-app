import { useDispatch } from 'react-redux';
import { voteThread, voteComment, optimisticVoteThread, optimisticVoteComment } from '../../store/threadsSlice';
import useAuth from '../../hooks/useAuth';
import { VOTE_TYPES } from '../../utils/constants';

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

  const handleVote = () => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    const userId = user.id;
    let newVoteType;

    // Determine new vote type
    if (voteType === 'up') {
      // If already upvoted, neutralize; otherwise upvote
      newVoteType = upVotesBy.includes(userId) ? VOTE_TYPES.NEUTRAL : VOTE_TYPES.UP;
    } else if (voteType === 'down') {
      // If already downvoted, neutralize; otherwise downvote
      newVoteType = downVotesBy.includes(userId) ? VOTE_TYPES.NEUTRAL : VOTE_TYPES.DOWN;
    }

    // Apply optimistic update first
    if (type === 'thread') {
      dispatch(optimisticVoteThread({ threadId: itemId, voteType: newVoteType, userId }));
      // Then dispatch the actual API call
      dispatch(voteThread({ threadId: itemId, voteType: newVoteType }));
    } else if (type === 'comment') {
      dispatch(optimisticVoteComment({ commentId: itemId, voteType: newVoteType, userId }));
      // Then dispatch the actual API call
      dispatch(voteComment({ threadId, commentId: itemId, voteType: newVoteType }));
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
    
    return baseClass;
  };

  const getButtonContent = () => {
    if (voteType === 'up') {
      return '👍';
    }
    if (voteType === 'down') {
      return '👎';
    }
    return '';
  };

  return (
    <button
      type="button"
      className={getButtonClass()}
      onClick={handleVote}
      title={`${voteType === 'up' ? 'Upvote' : 'Downvote'} this ${type}`}
    >
      {getButtonContent()}
    </button>
  );
}

export default VoteButton;