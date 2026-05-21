import React from "react";

import "./Modal.css";


const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {

  // Don't Render If Closed
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        {/* ================================= */}
        {/* MODAL HEADER */}
        {/* ================================= */}

        <div className="modal-header">

          <h2>
            {title}
          </h2>

          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            ✖
          </button>

        </div>


        {/* ================================= */}
        {/* MODAL BODY */}
        {/* ================================= */}

        <div className="modal-body">

          {children}

        </div>

      </div>

    </div>
  );
};

export default Modal;