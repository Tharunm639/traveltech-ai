import React from 'react';
import './App.css';

export default function Testimonials() {
  return (
    <section className="section-container" style={{backgroundColor: '#f9f9f9'}}>
      <h2 className="section-title">Happy Customers</h2>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p className="review-text">"The trip was perfectly organized. Highly recommended!"</p>
          <div className="reviewer-info"><h4>Rahul Sharma</h4><span>Bangalore</span></div>
        </div>
        <div className="testimonial-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p className="review-text">"Excellent service! Best prices compared to others."</p>
          <div className="reviewer-info"><h4>Priya Menon</h4><span>Kerala</span></div>
        </div>
      </div>
    </section>
  );
}