import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        setPackages(data.docs || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <h2>Packages</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
        {packages.map(p => (
          <div key={p._id} style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
            <img src={p.images?.[0]} alt={p.title} style={{width:'100%',height:120,objectFit:'cover'}} />
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <p><strong>₹{p.price}</strong> • {p.durationDays}d • {p.type}</p>
            <Link to={`/packages/${p._id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
