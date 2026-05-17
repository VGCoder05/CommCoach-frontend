import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = ({ open, onClose, size = 'md', children, className = '' }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal--${size} ${className}`} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModalHeader = ({ children, onClose, className = '' }) => (
  <div className={`modal__header ${className}`}>
    <h2 className="modal__title">{children}</h2>
    {onClose && (
      <button className="modal__close" onClick={onClose} aria-label="Close">
        ✕
      </button>
    )}
  </div>
);

const ModalBody = ({ children, className = '' }) => (
  <div className={`modal__body ${className}`}>{children}</div>
);

const ModalFooter = ({ children, className = '' }) => (
  <div className={`modal__footer ${className}`}>{children}</div>
);

Modal.Header = ModalHeader;
Modal.Body   = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;