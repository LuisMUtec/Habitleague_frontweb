import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏆</span>
            <span className="brand-text">HabitLeague</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>

          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </Link>

          <Link
            to="/challenges"
            className={`nav-link ${isActive('/challenges') ? 'active' : ''}`}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Challenges</span>
          </Link>

          <Link
            to="/payments"
            className={`nav-link ${isActive('/payments') ? 'active' : ''}`}
          >
            <span className="nav-icon">💳</span>
            <span className="nav-text">Payments</span>
          </Link>

          <Link
            to="/tasks"
            className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Tasks</span>
          </Link>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="avatar-image"
                />
              ) : user.avatarId ? (
                <div className="avatar-placeholder">
                  {user.avatarId.startsWith('male') ? '👨' : '👩'}
                </div>
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user.firstName}</span>
              <button
                onClick={handleLogout}
                className="logout-button"
                title="Logout"
              >
                <span className="logout-icon">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 