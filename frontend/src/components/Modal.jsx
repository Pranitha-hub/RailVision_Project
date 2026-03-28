import React from 'react';

const Modal = ({ title, children, onClose }) => {
  return (
    <>
      <div className="modal-backdrop active" onClick={onClose}></div>
      <div className="modal active" style={{ display: 'block' }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" id="modal-body">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
