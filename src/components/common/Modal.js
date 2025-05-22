// File: src/components/common/Modal.js
import { useEffect } from 'react';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'info', // 'info', 'success', 'error', 'warning', 'confirm'
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false
}) {
  // Close modal dengan ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close modal ketika click backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getModalIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'confirm':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const getModalClass = () => {
    return `modal-content modal-${type}`;
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className={getModalClass()}>
        <div className="modal-header">
          <div className="modal-icon" aria-hidden="true">
            {getModalIcon()}
          </div>
          {title && (
            <h3 id="modal-title" className="modal-title">
              {title}
            </h3>
          )}
          <button 
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div id="modal-description" className="modal-body">
          {children}
        </div>
        
        <div className="modal-footer">
          {showCancel && (
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button 
            type="button"
            className={`btn ${type === 'error' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm || onClose}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;