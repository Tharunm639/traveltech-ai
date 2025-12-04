import React, { useEffect, useState } from 'react';

export default function ItinerariesPage({ token }) {
  const [itins, setItins] = useState([]);

  const fetchItins = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/itineraries', { headers });
      const j = await res.json();
      setItins(Array.isArray(j) ? j : j.value || j.docs || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchItins(); }, [token]);

  const del = async (id) => {
    if (!window.confirm('Delete itinerary?')) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchItins();
      else { const j = await res.json(); alert('Error: ' + (j.error || JSON.stringify(j))); }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Itineraries</h2>
      <ul>
        {itins.map(it => (
          <li key={it._id} style={{ marginBottom: 12, border: '1px solid #eee', padding: 15, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{it.name}</strong>
                <span style={{ marginLeft: 10, fontSize: 12, background: it.type === 'ai' ? '#e3f2fd' : '#fff3e0', padding: '2px 8px', borderRadius: 4 }}>
                  {it.type === 'ai' ? '🤖 AI Trip' : '📦 Package Trip'}
                </span>
              </div>
              <div>
                <a href={`/itineraries/${it._id}`} style={{ marginRight: 10, textDecoration: 'none', color: '#1976d2' }}>View Details</a>
                <button onClick={() => del(it._id)} style={{ background: 'crimson', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
            {it.type === 'package' && (
              <ul style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
                {it.items?.map((itItem, idx) => <li key={idx}>{itItem.package?.title || itItem.package}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
