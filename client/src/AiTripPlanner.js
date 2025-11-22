import React, { useState } from 'react';
import './App.css';

export default function AiTripPlanner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ destination: '', days: 3, budget: 'Medium', vibe: 'Relaxed' });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const generateTrip = () => {
    setLoading(true);
    
    // Simulate AI Processing (Replace this with a real API call to /api/ai later)
    setTimeout(() => {
      const mockPlan = Array.from({ length: formData.days }, (_, i) => ({
        day: i + 1,
        morning: `Visit famous landmarks in ${formData.destination}`,
        afternoon: `Lunch at a local ${formData.budget} restaurant and explore markets.`,
        evening: `Enjoy the ${formData.vibe} nightlife or a sunset dinner.`
      }));
      setItinerary(mockPlan);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="section-container" style={{ maxWidth: 800 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, color: '#222', marginBottom: 10 }}>AI Trip Genius 🤖</h1>
        <p style={{ fontSize: 18, color: '#666' }}>Tell us your dream, and we'll plan the reality.</p>
      </div>

      <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        
        {!itinerary && !loading && (
          <>
            {/* Step 1: Destination */}
            {step === 1 && (
              <div className="fade-in">
                <h3>Where do you want to go?</h3>
                <input 
                  type="text" 
                  placeholder="e.g. Paris, Bali, Tokyo..." 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  style={inputStyle}
                  autoFocus
                />
                <button 
                    className="view-btn" 
                    onClick={() => setStep(2)} 
                    disabled={!formData.destination}
                    style={{width: '100%', marginTop: 10}}
                >
                    Next ➝
                </button>
              </div>
            )}

            {/* Step 2: Duration & Vibe */}
            {step === 2 && (
              <div className="fade-in">
                <h3>How long & What style?</h3>
                <div style={{ marginBottom: 20 }}>
                  <label style={{display:'block', marginBottom: 10, fontWeight:'bold'}}>Duration: {formData.days} Days</label>
                  <input 
                    type="range" min="1" max="14" value={formData.days} 
                    onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                  {['Relaxed', 'Adventure', 'Romantic', 'Cultural'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setFormData({...formData, vibe: v})}
                      style={{
                        ...tagStyle,
                        background: formData.vibe === v ? '#d32f2f' : '#f0f0f0',
                        color: formData.vibe === v ? 'white' : '#333'
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <button onClick={() => setStep(1)} style={{border:'none', background:'none', cursor:'pointer', fontSize: 16}}>← Back</button>
                  <button className="view-btn" onClick={generateTrip}>Generate Itinerary ✨</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner"></div>
            <h3 style={{ marginTop: 20 }}>Curating your perfect trip to {formData.destination}...</h3>
            <p>Checking flights... Finding hotels... Looking for hidden gems...</p>
          </div>
        )}

        {/* Results State */}
        {itinerary && (
          <div className="fade-in">
            <h2 style={{ color: '#d32f2f', borderBottom:'2px solid #eee', paddingBottom: 15 }}>
              Your {formData.days}-Day {formData.vibe} Trip to {formData.destination}
            </h2>
            <div style={{ marginTop: 30 }}>
              {itinerary.map((day) => (
                <div key={day.day} style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                  <div style={{ 
                    background: '#333', color: 'white', width: 50, height: 50, 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: 16, flexShrink: 0
                  }}>
                    Day {day.day}
                  </div>
                  <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, width: '100%' }}>
                    <p><strong>🌅 Morning:</strong> {day.morning}</p>
                    <p><strong>☀️ Afternoon:</strong> {day.afternoon}</p>
                    <p><strong>🌙 Evening:</strong> {day.evening}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-btn" onClick={() => {setItinerary(null); setStep(1);}}>Plan Another Trip</button>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '15px', fontSize: '18px', borderRadius: '8px', 
  border: '1px solid #ddd', marginBottom: '20px', outline: 'none', boxSizing: 'border-box'
};

const tagStyle = {
  padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '500'
};