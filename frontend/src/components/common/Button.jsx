import React from "react";

import "./Button.css";


const Button = ({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        custom-btn
        ${variant}
        ${fullWidth ? "full-width" : ""}
      `}
    >

      {icon && (
        <span className="btn-icon">
          {icon}
        </span>
      )}

      {text}

    </button>
  );
};

export default Button;