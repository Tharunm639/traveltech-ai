import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const images = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", // Switzerland
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", // Beach
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop", // Kyoto
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2666&auto=format&fit=crop"  // Cinque Terre
];

export default function HomeHero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/packages?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="tt-hero" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${images[currentImage]})`,
            transition: 'background-image 1s ease-in-out'
        }}>
            <div className="tt-hero-inner">
                <div className="hero-content">
                    <h1 className="hero-title">Your Next Adventure Starts Here.</h1>
                    <p className="hero-subtitle">
                        Discover 100+ curated packages and plan your itinerary with our AI Genius.
                    </p>

                    <form onSubmit={handleSearch} className="tt-search-bar">
                        <input
                            type="text"
                            placeholder="Search Destinations, Packages, or Themes (e.g., Paris, Family Trip)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="tt-search-input"
                        />
                        <button type="submit" className="tt-search-btn">
                            Search
                        </button>
                    </form>

                    <div className="value-props">
                        <span>✓ Best Price Guaranteed</span>
                        <span>✓ 24/7 Expert Support</span>
                        <span>✓ AI Powered Planning</span>
                    </div>

                </div>
            </div>
        </div>
    );
}