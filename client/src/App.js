import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Page Imports ---
import AuthPage from './AuthPage';
import AdminPage from './AdminPage';
import NavBar from './NavBar';
import Packages from './Packages';
import PackageDetail from './PackageDetail';
import Destinations from './Destinations';
import DestinationDetail from './DestinationDetail';
import AdminEnquiries from './AdminEnquiries';
import HomeHero from './HomeHero';
import AdminAi from './AdminAi';
import ItinerariesPage from './ItinerariesPage';

// ✅ NEW: Import the new AI Planner (instead of AiDemo)
import AiTripPlanner from './AiTripPlanner'; 

// ✅ NEW: Import Footer
import Footer from './Footer'; 

// --- Component Imports ---
import PackageSection from './PackageSection';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';

// --- Styles ---
import "./index.css";
import "./App.css"; 

function App() {
  const [packages, setPackages] = useState([]);
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('tt_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('tt_user') || 'null'));

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data.docs || []);
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []); 

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navigation Bar */}
        <NavBar user={user} />

        <Routes>
          {/* --- Home Page --- */}
          <Route path="/" element={
            <div className="home-page">
              <HomeHero />
              <PackageSection title="Trending Holiday Packages" packages={packages} />
              <WhyChooseUs />
              <Testimonials />
            </div>
          } />

          {/* --- Public Pages --- */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          
          {/* ✅ CORRECTED ROUTE: Use AiTripPlanner */}
          <Route path="/ai" element={<AiTripPlanner />} />
          
          <Route path="/itineraries" element={<ItinerariesPage token={token} />} />
          <Route path="/auth" element={<AuthPage onAuth={(t,u)=>{ setToken(t); setUser(u); }} />} />

          {/* --- Admin Protected Routes --- */}
          <Route 
            path="/admin" 
            element={user && user.role === 'admin' ? <AdminPage token={token} user={user} fetchPackages={fetchPackages} packages={packages} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/admin/enquiries" 
            element={user && user.role === 'admin' ? <AdminEnquiries token={token} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/admin/ai" 
            element={user && user.role === 'admin' ? <AdminAi token={token} /> : <Navigate to="/auth" />} 
          />

        </Routes>

        {/* ✅ Footer at the bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;