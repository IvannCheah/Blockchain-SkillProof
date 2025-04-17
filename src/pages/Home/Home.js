import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="homepage">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to SkillProof</h1>
          <p>Validate and Showcase Your Skills with Blockchain Technology</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </header>

      {/* Other sections of your homepage */}
      <section className="features-section">
        <div className="feature-box">
          <i className="fas fa-check-circle"></i>
          <h3>Skill Verification</h3>
          <p>Get your skills verified and trusted by employers worldwide.</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-star"></i>
          <h3>Reputation Building</h3>
          <p>Build and manage your professional reputation with ease.</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-lock"></i>
          <h3>Blockchain Security</h3>
          <p>Experience unmatched security with blockchain technology.</p>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"SkillProof has transformed the way I showcase my skills."</p>
            <p>- Jane Doe</p>
          </div>
          <div className="testimonial">
            <p>"A game-changer for professional validation."</p>
            <p>- John Smith</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
