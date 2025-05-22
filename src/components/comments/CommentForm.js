import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/threadsSlice';

function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.threads);
  
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Comment content is required');
      return;
    }
    
    try {
      const result = await dispatch(createComment({ threadId, content }));
      if (createComment.fulfilled.match(result)) {
        setContent(''); // Clear form on success
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

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
          disabled={loading}
          rows="4"
          placeholder="Write your comment here..."
        />
      </div>
      
      <button 
        type="submit" 
        className="submit-btn"
        disabled={loading || !content.trim()}
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

export default CommentForm;