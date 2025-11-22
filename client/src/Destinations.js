import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/destinations');
        const j = await res.json();
        setDestinations(j.docs || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <h2>Destinations</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {destinations.map(d => (
          <div key={d._id} style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
            <img src={d.imageUrl} alt={d.name} style={{width:'100%',height:120,objectFit:'cover'}} />
            <h3>{d.name}</h3>
            <p>{d.country} • {d.region}</p>
            <Link to={`/destinations/${d._id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
