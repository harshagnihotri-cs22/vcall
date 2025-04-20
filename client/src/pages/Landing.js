import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to VCall</h1>
          <p>Connect with anyone, anywhere through high-quality video calls</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose VCall?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎥</div>
            <h3>HD Video Calls</h3>
            <p>Crystal clear video quality for seamless communication</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>End-to-end encryption for your privacy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Global Access</h3>
            <p>Connect with anyone across the globe</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Reliable</h3>
            <p>Low latency and stable connections</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Start Video Calling?</h2>
          <p>Join thousands of users who trust VCall for their communication needs</p>
          <Link to="/signup" className="btn btn-primary">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
};

export default Landing; 