import React from 'react';

const ModalWithFlipAnimation = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  animationType = 'flip' // 'flip', 'slide', 'fade'
}) => {
  if (!isOpen) return null;

  const getAnimationClass = () => {
    switch (animationType) {
      case 'flip':
        return 'modal-flip';
      case 'slide':
        return 'modal-slide';
      case 'fade':
        return 'modal-fade';
      default:
        return 'modal-fade';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${getAnimationClass()}`}
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside modal
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          minWidth: '300px',
          maxWidth: '800px',
          margin: '0 auto',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5em', color: '#333' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5em',
              cursor: 'pointer',
              color: '#666',
              padding: '5px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWithFlipAnimation;