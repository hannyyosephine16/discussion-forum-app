import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/threadsSlice';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';

function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.threads);
  const { user, isAuthenticated } = useAuth();
  
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  console.log('CommentForm props:', { threadId, isAuthenticated, user }); // Debug

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setModalMessage('Comment content is required');
      setShowErrorModal(true);
      return;
    }

    if (!isAuthenticated) {
      setModalMessage('Please login to comment');
      setShowErrorModal(true);
      return;
    }

    if (!threadId) {
      setModalMessage('Thread ID is missing');
      setShowErrorModal(true);
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
        setModalMessage('Comment posted successfully!');
        setShowSuccessModal(true);
      } else if (createComment.rejected.match(result)) {
        console.error('Comment creation failed:', result.error || result.payload); // Debug
        setModalMessage(`Failed to post comment: ${result.payload || 'Unknown error'}`);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('Comment submission error:', err); // Debug
      setModalMessage(`Error posting comment: ${err.message}`);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
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
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Success"
        confirmText="Great!"
      >
        <p>{modalMessage}</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        title="Error"
        confirmText="OK"
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
}

export default CommentForm;