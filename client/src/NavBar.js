import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

export default function NavBar({ user }) {
  return (
    <header className="tt-header">
      <div className="tt-header-inner">
        <div className="tt-brand">
          <Link to="/" className="tt-logo">TravelTech</Link>
        </div>

        <nav className="tt-nav">
          <Link to="/packages">Packages</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/ai">AI Demo</Link>
          <Link to="/itineraries">My Itineraries</Link>
        </nav>

        <div className="tt-actions">
          {!user && <Link to="/auth" className="tt-btn">Sign In</Link>}
          {user && user.role === 'admin' && <Link to="/admin" className="tt-btn tt-btn-outline">Admin</Link>}
        </div>
      </div>
    </header>
  );
}
