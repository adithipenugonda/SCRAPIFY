import React from "react";

import {
  Link,
} from "react-router-dom";

import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">

      <div className="container footer-container">

        {/* ================================= */}
        {/* BRAND */}
        {/* ================================= */}

        <div className="footer-brand">

          <h2>
            ♻️ Scrapify
          </h2>

          <p>
            Transforming waste into
            sustainable value through
            smart recycling and
            eco-friendly technology.
          </p>

        </div>


        {/* ================================= */}
        {/* QUICK LINKS */}
        {/* ================================= */}

        <div className="footer-links">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/user/dashboard">
            Dashboard
          </Link>

          <Link to="/schedule-pickup">
            Schedule Pickup
          </Link>

          <Link to="/green-points">
            Rewards
          </Link>

        </div>


        {/* ================================= */}
        {/* CONTACT */}
        {/* ================================= */}

        <div className="footer-contact">

          <h3>
            Contact
          </h3>

          <p>
            📍 Hyderabad, India
          </p>

          <p>
            📧 support@scrapify.com
          </p>

          <p>
            📞 +91 9876543210
          </p>

        </div>

      </div>


      {/* ===================================== */}
      {/* BOTTOM */}
      {/* ===================================== */}

      <div className="footer-bottom">

        <p>
          © 2026 Scrapify.
          All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;