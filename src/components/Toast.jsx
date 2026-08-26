import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <i className={type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} style={{ color: type === 'success' ? '#10B981' : '#EF4444', fontSize: '1.2rem' }}></i>
        <span>{message}</span>
      </div>
    </div>
  );
}
