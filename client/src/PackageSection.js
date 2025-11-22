import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

export default function PackageSection({ title, packages }) {
  // Safety check: if packages haven't loaded yet, show nothing or a loader
  if (!packages) return null;

  return (
    <section className="section-container">
      <h2 className="section-title">{title}</h2>
      <div className="cards-grid">
        {packages.map((pkg) => (
          <div key={pkg._id} className="travel-card">
            
            {/* Image Area */}
            <div className="card-image-container">
              <img 
                src={pkg.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'} 
                alt={pkg.title} 
                className="card-image"
              />
              <span className="card-badge">{pkg.durationDays} Days</span>
            </div>

            {/* Content Area */}
            <div className="card-content">
              <h3 className="card-title">{pkg.title}</h3>
              <p className="card-destination">
                📍 {pkg.destination?.name || pkg.type || 'Tour Package'}
              </p>
              
              <p className="card-summary">
                {pkg.summary ? pkg.summary.substring(0, 60) + '...' : ''}
              </p>

              <div className="card-footer">
                <div className="price-box">
                  <span className="start-text">Starts from</span>
                  <span className="price-amount">₹{pkg.price.toLocaleString()}</span>
                </div>
                <Link to={`/packages/${pkg._id}`} className="view-btn">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}