import React from 'react';
import './App.css';

export default function WhyChooseUs() {
  const features = [
    { icon: "🏆", title: "World Class Service", desc: "Premium experiences with personalized care." },
    { icon: "💰", title: "Best Price Guarantee", desc: "Unbeatable prices without hidden costs." },
    { icon: "🌍", title: "Diverse Destinations", desc: "Covering over 50+ countries." },
    { icon: "🎧", title: "24/7 Support", desc: "Always available to assist you." }
  ];

  return (
    <section className="section-container">
      <h2 className="section-title">Why Choose Us?</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}