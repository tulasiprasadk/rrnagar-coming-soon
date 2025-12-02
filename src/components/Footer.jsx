import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rn-footer" role="contentinfo">

      {/* ================= TOP FOOTER ================= */}
      <div className="rn-footer-inner">

        {/* LEFT SIDE */}
        <div className="footer-left">

          <div className="footer-left-row">
            <strong>Contact us:</strong> Phone: +91 9844007900
          </div>

          <div className="footer-left-row">
            <span><strong>Email:</strong> hello@rrnagar.local</span>
            <span><strong>Address:</strong> RR Nagar, Bengaluru</span>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">

          <div className="footer-right-row">
            <strong>Follow us:</strong>
            <span className="social-pill fb">FB</span>
            <span className="social-pill tw">TW</span>
            <span className="social-pill ig">IG</span>
          </div>

          <div className="footer-right-row footer-heart">
            Made with <span className="heart-red">♥</span> for the community
          </div>

        </div>

      </div>

      {/* ================= BOTTOM FOOTER ================= */}
      <div className="rn-footer-bottom">
        <div className="rn-footer-bottom-inner">
          <span>© {year} RR Nagar. All rights reserved.</span>

          <span className="bottom-links">
            <Link to="/privacy">Privacy Notices</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/help">Help</Link>
            <Link to="/supplier">Supplier</Link>
            <Link to="/partner-us">Partner Us</Link>
          </span>
        </div>
      </div>

    </footer>
  );
}
