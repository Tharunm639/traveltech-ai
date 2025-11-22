import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DestinationDetail() {
  const { id } = useParams();
  const [dest, setDest] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`/api/destinations/${id}`),
          fetch(`/api/packages?destinationId=${id}`)
        ]);
        if (r1.ok) setDest(await r1.json());
        if (r2.ok) {
          const j = await r2.json();
          setPackages(j.docs || []);
        }
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  if (!dest) return <div style={{padding:20}}>Loading destination...</div>;

  return (
    <div style={{padding:20}}>
      <h2>{dest.name}</h2>
      <img src={dest.imageUrl} alt={dest.name} style={{width:'100%',maxHeight:360,objectFit:'cover'}} />
      <p>{dest.country} • {dest.region}</p>
      <p>{dest.description || dest.shortDescription}</p>

      <h3>Packages for {dest.name}</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {packages.map(p => (
          <div key={p._id} style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
            <img src={p.images?.[0]} alt={p.title} style={{width:'100%',height:120,objectFit:'cover'}} />
            <h4>{p.title}</h4>
            <p>₹{p.price} • {p.durationDays} days</p>
            <Link to={`/packages/${p._id}`}>View package</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
