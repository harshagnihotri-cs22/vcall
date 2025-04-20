/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoIcon, ScreenShareIcon, ChatIcon } from '../components/Icons';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Connect Anywhere with VCall</h1>
          <p>Experience seamless video conferencing with crystal-clear quality. Join meetings, share screens, and collaborate with anyone, anywhere in the world.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/register" className="btn btn-secondary">Create Account</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-title">
          <h2>Why Choose VCall?</h2>
          <p>Our platform offers everything you need for professional video collaboration</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <VideoIcon />
            </div>
            <h3>HD Video Calls</h3>
            <p>Crystal clear video quality with adaptive streaming to ensure smooth communication even on slower networks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>End-to-end encryption for all your conversations, ensuring your meetings remain confidential and secure.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ChatIcon />
            </div>
            <h3>Real-time Chat</h3>
            <p>Built-in text chat feature for instant messaging during meetings to share links and important information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <ScreenShareIcon />
            </div>
            <h3>Screen Sharing</h3>
            <p>Present your work with one-click screen sharing, making collaboration and presentations seamless.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Getting started with VCall is simple and takes just minutes</p>
        </div>
        <div className="steps">
          <div className="step">
            <h3>Create an Account</h3>
            <p>Sign up for free and get started with your personal VCall account in just a few clicks.</p>
          </div>
          <div className="step">
            <h3>Start or Join a Meeting</h3>
            <p>Create a new meeting room or join an existing one with a simple meeting ID.</p>
          </div>
          <div className="step">
            <h3>Connect & Collaborate</h3>
            <p>Invite teammates, share your screen, chat, and work together in real-time.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-title">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied users who rely on VCall for their communication needs</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">
              "VCall has transformed how our remote team collaborates. The video quality is excellent, and the interface is intuitive. It's now an essential part of our daily workflow."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Product Manager</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">
              "I've tried many video conferencing tools, but VCall stands out with its reliability and ease of use. Screen sharing works flawlessly, which is critical for my client presentations."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <h4>Michael Roberts</h4>
                <p>Marketing Consultant</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-quote">
              "As a teacher, I needed a reliable platform for virtual classes. VCall's stability and features like breakout rooms have made online teaching much more effective."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">L</div>
              <div className="author-info">
                <h4>Lisa Chen</h4>
                <p>Educator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Video Calling?</h2>
          <p>Join thousands of users who trust VCall for their communication needs</p>
          <Link to="/register" className="btn btn-primary">Create Free Account</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-info">
            <p>&copy; {new Date().getFullYear()} VCall. All rights reserved.</p>
            <p>Secure video conferencing for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;