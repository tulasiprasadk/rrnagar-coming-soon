import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/rrlogo.png";

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-left">

        {/* LOGO links back to home */}
        <Link to="/">
          <img src={logo} alt="RR Nagar Logo" className="rr-logo" />
        </Link>

        <div className="rr-tagline">RR ನಗರದ ಹೊಸ ಡಿಜಿಟಲ್ ಅನುಭವ</div>
      </div>

      <nav className="header-nav">
        <a href="/account">Your Account</a>
        <a href="/contact">Contact</a>
        <a href="/blogs">Blogs</a>
        <a href="/faqs">FAQs</a>
      </nav>
    </header>
  );
}
