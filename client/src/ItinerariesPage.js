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
      else { const j = await res.json(); alert('Error: ' + (j.error||JSON.stringify(j))); }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{padding:20}}>
      <h2>My Itineraries</h2>
      <ul>
        {itins.map(it => (
          <li key={it._id} style={{marginBottom:12}}>
            <strong>{it.name}</strong> — {it.items?.length || 0} items
            <button style={{marginLeft:8}} onClick={()=>del(it._id)}>Delete</button>
            <ul>
              {it.items?.map((itItem, idx) => <li key={idx}>{itItem.package?.title || itItem.package}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
