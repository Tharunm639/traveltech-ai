import React, { useState } from 'react';
import './App.css';

export default function AiTripPlanner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ destination: '', days: 3, budget: 'Medium', vibe: 'Relaxed' });
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // New state for save status

  // --- Utility Functions ---

  const getAuthHeaders = () => {
    const token = localStorage.getItem('tt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // --- Core Logic ---

  const generateTrip = async () => {
    setLoading(true);
    setError('');
    setTripData(null);
    setSaveStatus('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseJson = await res.json();

      if (!res.ok || responseJson.error) {
        throw new Error(responseJson.error || 'Unknown API Error');
      }

      setTripData(responseJson);

    } catch (err) {
      console.error("Frontend AI Error:", err);
      setError(`AI Error: ${err.message}. Try simplifying your request.`);
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async () => {
    setSaveStatus('saving');
    try {
      const auth = getAuthHeaders();
      if (!auth.Authorization) {
        alert("Please log in to save your itinerary.");
        setSaveStatus('');
        return;
      }

      const body = {
        name: `AI Trip: ${formData.destination} (${formData.days} days)`,
        type: 'ai',
        details: tripData,
      };

      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveStatus('success');
      } else {
        const j = await res.json();
        setSaveStatus(`failed: ${j.error || 'Server error'}`);
      }

    } catch (e) {
      console.error("Save failed:", e);
      setSaveStatus('failed: Network error');
    }
  };

  // --- Render ---
  return (
    <div className="section-container" style={{ maxWidth: 900 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, color: '#222', marginBottom: 10 }}>AI Trip Genius 🤖</h1>
        <p style={{ fontSize: 18, color: '#666' }}>Frontend-powered itineraries (Bypassing server issues).</p>
      </div>

      <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>

        {!tripData && !loading && (
          <>
            {/* Step 1: Destination */}
            {step === 1 && (
              <div className="fade-in">
                <h3>Where do you want to go?</h3>
                <input
                  type="text"
                  placeholder="e.g. Paris, Bali, Tokyo..."
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  style={inputStyle}
                  autoFocus
                />
                <button
                  className="view-btn"
                  onClick={() => setStep(2)}
                  disabled={!formData.destination}
                  style={{ width: '100%', marginTop: 10 }}
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
                  <label style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}>Duration: {formData.days} Days</label>
                  <input
                    type="range" min="1" max="10" value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                  {['Relaxed', 'Adventure', 'Romantic', 'Cultural'].map(v => (
                    <button
                      key={v}
                      onClick={() => setFormData({ ...formData, vibe: v })}
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>← Back</button>
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
            <h3 style={{ marginTop: 20 }}>Planning your perfect trip to {formData.destination}...</h3>
            <p>Processing complex travel data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: 20 }}>
            <p>{error}</p>
            <button onClick={() => { setLoading(false); setError(''); setStep(1); }} className="view-btn">Try Again</button>
          </div>
        )}

        {/* --- RESULTS DISPLAY --- */}
        {tripData && (
          <div className="fade-in">
            <h2 style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: 15, marginBottom: 30 }}>
              Your Custom Trip to {formData.destination}
            </h2>

            {/* 1. HOTELS SECTION */}
            {tripData.hotels && tripData.hotels.length > 0 && (
              <>
                <h3 style={{ marginBottom: 20 }}>🏨 Recommended Hotels ({formData.budget})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
                  {tripData.hotels.map((hotel, index) => (
                    <div key={index} style={{ border: '1px solid #eee', borderRadius: 12, padding: 20, background: '#f9f9f9' }}>
                      <h4 style={{ margin: '0 0 10px 0' }}>{hotel.name}</h4>
                      <p style={{ color: '#d32f2f', fontWeight: 'bold', margin: '0 0 10px 0' }}>{hotel.price}</p>
                      <p style={{ fontSize: 14, color: '#666' }}>{hotel.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 2. ITINERARY SECTION */}
            <h3 style={{ marginBottom: 20 }}>📅 Day-by-Day Plan</h3>
            <div style={{ marginTop: 10 }}>
              {tripData.itinerary?.map((day) => (
                <div key={day.day} style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                  <div style={{
                    background: '#333', color: 'white', width: 50, height: 50,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: 16, flexShrink: 0
                  }}>
                    Day {day.day}
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #eee', padding: 20, borderRadius: 12, width: '100%', textAlign: 'left', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <p style={{ marginBottom: 8 }}><strong>🌅 Morning:</strong> {day.morning}</p>
                    <p style={{ marginBottom: 8 }}><strong>☀️ Afternoon:</strong> {day.afternoon}</p>
                    <p><strong>🌙 Evening:</strong> {day.evening}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. SAVE BUTTON */}
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              {saveStatus === 'success' ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Itinerary Saved!</p>
              ) : (
                <button
                  onClick={saveItinerary}
                  disabled={saveStatus === 'saving'}
                  style={{ ...inputStyle, width: 300, background: saveStatus === 'failed' ? 'crimson' : '#d32f2f', color: 'white', cursor: 'pointer', margin: 0 }}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save This Trip'}
                </button>
              )}
              {saveStatus.startsWith('failed') && <p style={{ color: 'crimson', fontSize: 14 }}>{saveStatus.substring(8)}</p>}

              <button onClick={() => { setTripData(null); setStep(1); setSaveStatus(''); }} style={{ ...tagStyle, marginLeft: 15, background: '#eee' }}>
                Plan New Trip
              </button>
            </div>
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