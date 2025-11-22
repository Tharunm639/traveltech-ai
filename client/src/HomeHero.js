import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

// MUST HAVE "export default"
export default function HomeHero() {
  return (
    <div className="hero-container" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://source.unsplash.com/1600x900/?travel,nature")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{fontSize: '48px', marginBottom: '20px', fontWeight: 'bold'}}>
        Explore the World with Us
      </h1>
      <p style={{fontSize: '20px', marginBottom: '30px', maxWidth: '600px'}}>
        Discover amazing places and create unforgettable memories with our premium travel packages.
      </p>
      <Link to="/packages" style={{
        padding: '15px 30px',
        backgroundColor: '#d32f2f',
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        borderRadius: '50px',
        fontWeight: 'bold'
      }}>
        View Packages
      </Link>
    </div>
  );
}