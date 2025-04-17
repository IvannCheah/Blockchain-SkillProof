import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">About Us</Link>
        <span className="divider">|</span>
        <Link to="/">Contact Us</Link>
        <span className="divider">|</span>
        <Link to="/">Privacy Policy</Link>
        <span className="divider">|</span>
        <Link to="/">Terms of Service</Link>
      </div>
      <div className="social-media">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
      </div>
    </footer>
  );
};

export default Footer;
