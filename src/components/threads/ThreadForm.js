// File: src/components/threads/ThreadForm.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../../store/threadsSlice';
import Modal from '../common/Modal';

function ThreadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.threads);
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
  });

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [createdThreadId, setCreatedThreadId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      setModalMessage('Title and body are required');
      setShowErrorModal(true);
      return;
    }
    
    try {
      const result = await dispatch(createThread(formData));
      
      if (createThread.fulfilled.match(result)) {
        // Reset form
        setFormData({
          title: '',
          body: '',
          category: '',
        });
        
        // Store created thread ID for navigation
        setCreatedThreadId(result.payload.id);
        
        // Show success modal
        setModalMessage(`Thread "${formData.title}" has been created successfully!`);
        setShowSuccessModal(true);
      } else if (createThread.rejected.match(result)) {
        setModalMessage(`Failed to create thread: ${result.payload || 'Unknown error'}`);
        setShowErrorModal(true);
      }
    } catch (err) {
      setModalMessage(`Error creating thread: ${err.message}`);
      setShowErrorModal(true);
    }
  };

  const handleViewThread = () => {
    setShowSuccessModal(false);
    navigate(`/thread/${createdThreadId}`);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="thread-form">
        <h2>Create New Thread</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={loading}
            placeholder="Enter thread title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category (optional):</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="e.g., General, Tech, News"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="body">Content:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
            disabled={loading}
            rows="10"
            placeholder="Write your thread content here..."
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Thread'}
          </button>
        </div>
      </form>

      {/* Success Modal with Action Options */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoHome}
        type="success"
        title="Thread Created Successfully!"
        confirmText="View Thread"
        cancelText="Go to Home"
        showCancel={true}
        onConfirm={handleViewThread}
      >
        <p>{modalMessage}</p>
        <p>What would you like to do next?</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        title="Error Creating Thread"
        confirmText="OK"
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
}

export default ThreadForm;