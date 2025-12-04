import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus(j.error || 'Failed');
      }
    } catch (err) {
      setStatus('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', paddingTop: '60px', paddingBottom: '20px' }}>
      <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

        {/* Column 1 */}
        <div>
          <h3 style={{ color: '#d32f2f', fontSize: '24px', margin: '0 0 20px 0' }}>TravelTech</h3>
          <p style={{ color: '#bbb', lineHeight: '1.6', marginBottom: 20 }}>
            We use AI to craft the perfect holiday experience for you. Discover the world with technology.
          </p>
          <div style={{ display: 'flex', gap: 15 }}>
            {/* Social Icons (Mock) */}
            {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
              <div key={social} style={{
                width: 36, height: 36, background: '#333', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff'
              }}>
                {social[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 style={{ margin: '0 0 20px 0' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/packages" style={{ color: '#bbb', textDecoration: 'none' }}>Packages</Link></li>
            <li><Link to="/destinations" style={{ color: '#bbb', textDecoration: 'none' }}>Destinations</Link></li>
            <li><Link to="/ai" style={{ color: '#bbb', textDecoration: 'none' }}>AI Planner</Link></li>
            <li><Link to="/contact" style={{ color: '#bbb', textDecoration: 'none' }}>Contact Us</Link></li>
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
          <form onSubmit={subscribe}>
            <input
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '4px', border: 'none', marginBottom: '10px' }}
              type="email"
              required
              disabled={loading}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {status && (
              <div style={{ marginTop: 8, color: status === 'success' ? 'lightgreen' : 'crimson', fontSize: 13, minHeight: 18 }}>
                {status === 'success' ? 'Thank you for subscribing!' : status}
              </div>
            )}
          </form>
        </div>
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid #333', marginTop: '40px', paddingTop: '20px', color: '#666', fontSize: 14 }}>
        <p>&copy; 2025 TravelTech Solutions. All rights reserved.</p>
        <div style={{ marginTop: 10 }}>
          <span style={{ margin: '0 10px', cursor: 'pointer' }}>Privacy Policy</span> |
          <span style={{ margin: '0 10px', cursor: 'pointer' }}>Terms of Service</span> |
          <span style={{ margin: '0 10px', cursor: 'pointer' }}>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}