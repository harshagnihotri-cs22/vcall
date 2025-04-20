import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();

  // Get user's first initial for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitial(currentUser?.name)}
          </div>
          <h1 className="profile-name">{currentUser?.name}</h1>
          <p className="profile-email">{currentUser?.email}</p>
        </div>

        <div className="profile-content">
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Meetings Created</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Minutes in Calls</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">0</div>
              <div className="profile-stat-label">Participants</div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Account Information</h2>
            <div className="profile-details">
              <div className="profile-field">
                <span className="profile-field-label">Full Name</span>
                <span className="profile-field-value">{currentUser?.name || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email Address</span>
                <span className="profile-field-value">{currentUser?.email || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Account Created</span>
                <span className="profile-field-value">
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : 'Not available'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-btn profile-btn-secondary">
              Edit Profile
            </button>
            <button className="profile-btn profile-btn-primary">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;