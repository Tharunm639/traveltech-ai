import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', paddingTop: '60px', paddingBottom: '20px' }}>
      <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        
        {/* Column 1 */}
        <div>
          <h3 style={{ color: '#d32f2f', fontSize: '24px', margin: '0 0 20px 0' }}>TravelTech</h3>
          <p style={{ color: '#bbb', lineHeight: '1.6' }}>
            We use AI to craft the perfect holiday experience for you. Discover the world with technology.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 style={{ margin: '0 0 20px 0' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/" style={{ color: '#bbb' }}>Home</Link></li>
            <li><Link to="/packages" style={{ color: '#bbb' }}>Packages</Link></li>
            <li><Link to="/destinations" style={{ color: '#bbb' }}>Destinations</Link></li>
            <li><Link to="/ai" style={{ color: '#bbb' }}>AI Planner</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 style={{ margin: '0 0 20px 0' }}>Contact</h4>
          <p style={{ color: '#bbb', marginBottom: '10px' }}>📞 +91 98765 43210</p>
          <p style={{ color: '#bbb', marginBottom: '10px' }}>📧 support@traveltech.com</p>
          <p style={{ color: '#bbb' }}>📍 Bangalore, India</p>
        </div>

        {/* Column 4 */}
        <div>
          <h4 style={{ margin: '0 0 20px 0' }}>Newsletter</h4>
          <input placeholder="Your Email" style={{ padding: '10px', width: '100%', borderRadius: '4px', border: 'none', marginBottom: '10px' }} />
          <button style={{ width: '100%', padding: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Subscribe</button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', borderTop: '1px solid #333', marginTop: '40px', paddingTop: '20px', color: '#666' }}>
        &copy; 2025 TravelTech Solutions. All rights reserved.
      </div>
    </footer>
  );
}