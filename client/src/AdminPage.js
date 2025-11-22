import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPage({ token, user, fetchPackages, packages }) {
  const [newDest, setNewDest] = useState({ name: '', slug: '', country: '' });
  // Added 'image' to the state
  const [newPkg, setNewPkg] = useState({ title: '', slug: '', destination: '', price: '', durationDays: '', image: '' });

  useEffect(() => {
    if (!packages || packages.length === 0) fetchPackages();
  }, []);

  const authHeaders = () => {
    const h = { 'Content-Type': 'application/json' };
    if (user && user.role === 'admin' && token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  const createDestination = async () => {
    try {
      const res = await fetch('/api/admin/destinations', { method: 'POST', headers: authHeaders(), body: JSON.stringify(newDest) });
      if (res.status === 201) { alert('Destination created'); setNewDest({ name: '', slug: '', country: '' }); fetchPackages(); }
      else { const j = await res.json(); alert('Error: ' + (j.error||JSON.stringify(j))); }
    } catch (e) { console.error(e); alert('Failed'); }
  };

  const createPackage = async () => {
    try {
      // Send image as an array to match backend schema
      const body = { 
        ...newPkg, 
        price: Number(newPkg.price), 
        durationDays: Number(newPkg.durationDays),
        images: newPkg.image ? [newPkg.image] : [] 
      };

      const res = await fetch('/api/admin/packages', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      if (res.status === 201) { 
        alert('Package created'); 
        setNewPkg({ title: '', slug: '', destination: '', price: '', durationDays: '', image: '' }); 
        fetchPackages(); 
      }
      else { const j = await res.json(); alert('Error: ' + (j.error||JSON.stringify(j))); }
    } catch (e) { console.error(e); alert('Failed'); }
  };

  const deletePackage = async (id) => {
    // FIX: Use window.confirm to avoid ESLint error
    if (!window.confirm('Delete package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { alert('Deleted'); fetchPackages(); } else { const j = await res.json(); alert('Error: ' + (j.error||JSON.stringify(j))); }
    } catch (e) { console.error(e); alert('Failed'); }
  };

  const deleteDestination = async (id) => {
    // FIX: Use window.confirm to avoid ESLint error
    if (!window.confirm('Delete destination?')) return;
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { alert('Deleted'); fetchPackages(); } else { const j = await res.json(); alert('Error: ' + (j.error||JSON.stringify(j))); }
    } catch (e) { console.error(e); alert('Failed'); }
  };

  // Logic to prevent duplicate destinations in dropdown
  const uniqueDestinations = [];
  const seenIds = new Set();
  packages.forEach(p => {
    if(p.destination && p.destination._id && !seenIds.has(p.destination._id)) {
      seenIds.add(p.destination._id);
      uniqueDestinations.push(p.destination);
    }
  });

  return (
    <div style={{padding:20}}>
      <h2>Admin Panel</h2>
      <p style={{marginBottom: 20}}>
        <Link to="/admin/enquiries" style={{color: '#007bff', textDecoration:'none', fontWeight:'bold'}}>View Enquiries</Link> • 
        <Link to="/admin/ai" style={{color: '#007bff', textDecoration:'none', fontWeight:'bold', marginLeft: 10}}>AI Admin</Link>
      </p>

      <div style={{display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap'}}>
        
        {/* --- Create Destination --- */}
        <div style={{flex:1, minWidth: '300px', border:'1px solid #ddd', padding: 20, borderRadius: 8, background: '#fff'}}>
          <h3>Create Destination</h3>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <input placeholder='Name' value={newDest.name} onChange={e=>setNewDest({...newDest,name:e.target.value})} style={{padding:8}} />
            <input placeholder='Slug (e.g. paris)' value={newDest.slug} onChange={e=>setNewDest({...newDest,slug:e.target.value})} style={{padding:8}} />
            <input placeholder='Country' value={newDest.country} onChange={e=>setNewDest({...newDest,country:e.target.value})} style={{padding:8}} />
            <button onClick={createDestination} style={{padding:10, background:'#444', color:'white', border:'none', cursor:'pointer'}}>Create Destination</button>
          </div>
        </div>

        {/* --- Create Package --- */}
        <div style={{flex:1, minWidth: '300px', border:'1px solid #ddd', padding: 20, borderRadius: 8, background: '#fff'}}>
          <h3>Create Package</h3>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <input placeholder='Title' value={newPkg.title} onChange={e=>setNewPkg({...newPkg,title:e.target.value})} style={{padding:8}} />
            <input placeholder='Slug (e.g. paris-tour)' value={newPkg.slug} onChange={e=>setNewPkg({...newPkg,slug:e.target.value})} style={{padding:8}} />
            <input placeholder='Image URL (https://...)' value={newPkg.image} onChange={e=>setNewPkg({...newPkg,image:e.target.value})} style={{padding:8}} />
            
            <select value={newPkg.destination} onChange={e=>setNewPkg({...newPkg,destination:e.target.value})} style={{padding:8}}>
              <option value=''>Select destination</option>
              {uniqueDestinations.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            
            <input placeholder='Price (₹)' type="number" value={newPkg.price} onChange={e=>setNewPkg({...newPkg,price:e.target.value})} style={{padding:8}} />
            <input placeholder='Duration (Days)' type="number" value={newPkg.durationDays} onChange={e=>setNewPkg({...newPkg,durationDays:e.target.value})} style={{padding:8}} />
            <button onClick={createPackage} style={{padding:10, background:'#d32f2f', color:'white', border:'none', cursor:'pointer'}}>Create Package</button>
          </div>
        </div>

        {/* --- List --- */}
        <div style={{flex:1, minWidth: '300px', border:'1px solid #ddd', padding: 20, borderRadius: 8, background: '#f9f9f9'}}>
          <h3>Existing Data</h3>
          
          <h4>Destinations</h4>
          <ul style={{paddingLeft: 20, maxHeight: 200, overflowY: 'auto'}}>
            {uniqueDestinations.map(d => (
              <li key={d._id} style={{marginBottom: 5}}>
                {d.name} 
                <button onClick={()=>deleteDestination(d._id)} style={{marginLeft:10, color:'red', border:'none', background:'none', cursor:'pointer', fontSize:12}}>Delete</button>
              </li>
            ))}
          </ul>

          <h4>Packages</h4>
          <ul style={{paddingLeft: 20, maxHeight: 300, overflowY: 'auto'}}>
            {packages.map(p => (
              <li key={p._id} style={{marginBottom: 5}}>
                {p.title} — ₹{p.price} 
                <button onClick={()=>deletePackage(p._id)} style={{marginLeft:10, color:'red', border:'none', background:'none', cursor:'pointer', fontSize:12}}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}