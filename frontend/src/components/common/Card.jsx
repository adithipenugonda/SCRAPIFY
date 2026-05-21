import React from "react";

import "./Card.css";


const Card = ({
  title,
  value,
  subtitle,
  icon,
  children,
  className = "",
}) => {
  return (
    <div className={`custom-card ${className}`}>

      {/* ================================= */}
      {/* CARD HEADER */}
      {/* ================================= */}

      {(title || icon) && (
        <div className="card-header">

          <div>

            {title && (
              <h3 className="card-title">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="card-subtitle">
                {subtitle}
              </p>
            )}

          </div>

          {icon && (
            <div className="card-icon">
              {icon}
            </div>
          )}

        </div>
      )}


      {/* ================================= */}
      {/* CARD BODY */}
      {/* ================================= */}

      <div className="card-body">

        {value && (
          <h2 className="card-value">
            {value}
          </h2>
        )}

        {children}

      </div>

    </div>
  );
};

export default Card;