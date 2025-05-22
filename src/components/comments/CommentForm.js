import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/threadsSlice';
import useAuth from '../../hooks/useAuth';

function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.threads);
  const { user, isAuthenticated } = useAuth();
  
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  console.log('CommentForm props:', { threadId, isAuthenticated, user }); // Debug

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Comment content is required');
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    if (!threadId) {
      alert('Thread ID is missing');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('Submitting comment:', { threadId, content, user: user?.id }); // Debug
      
      const result = await dispatch(createComment({ threadId, content }));
      console.log('Comment submission result:', result); // Debug
      
      if (createComment.fulfilled.match(result)) {
        setContent(''); // Clear form on success
        console.log('Comment created successfully!'); // Debug
        alert('Comment posted successfully!'); // Temporary feedback
      } else if (createComment.rejected.match(result)) {
        console.error('Comment creation failed:', result.error || result.payload); // Debug
        alert(`Failed to post comment: ${result.payload || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Comment submission error:', err); // Debug
      alert(`Error posting comment: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Add a Comment</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="comment-content">Your Comment:</label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading || submitting}
          rows="4"
          placeholder="Write your comment here..."
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || submitting || !content.trim()}
        >
          {(loading || submitting) ? 'Posting...' : 'Post Comment'}
        </button>
        
        {/* Debug info - remove in production
        <small style={{ color: '#666', marginLeft: '1rem' }}>
          Debug: ThreadID={threadId}, User={user?.name || 'None'}
        </small> */}
      </div>
    </form>
  );
}

export default CommentForm;