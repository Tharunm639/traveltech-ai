import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [tab, setTab] = useState('overview');
  const [imgIdx, setImgIdx] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        const j = await res.json();
        setPkg(j);
        // Fetch related packages (same destination, exclude current)
        if (j.destination?._id) {
          const relRes = await fetch(`/api/packages?destinationId=${j.destination._id}&limit=4`);
          const relData = await relRes.json();
          setRelated((relData.docs || []).filter(p => p._id !== id).slice(0, 3));
        } else {
          setRelated([]);
        }
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  if (!pkg) return <div style={{padding:40, textAlign:'center'}}>Loading Package Details...</div>;

  return (
    <div className="section-container">
      {/* Header Section */}
      <div style={{marginBottom: 30}}>
        <h1 style={{fontSize: 32, marginBottom: 10, color: '#222'}}>{pkg.title}</h1>
        <p style={{color: '#666', fontSize: 16}}>
          📍 {pkg.destination?.name || pkg.type || 'International'} • ⏳ {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
        </p>
        {/* Highlights as badges */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div style={{marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
            {pkg.highlights.map((h, i) => (
              <span key={i} style={{background:'#ffe082', color:'#b71c1c', fontWeight:600, borderRadius:8, padding:'4px 12px', fontSize:13}}>{h}</span>
            ))}
          </div>
        )}
      </div>

      <div className="detail-grid">
        {/* LEFT COLUMN: Gallery & Tabs */}
        <div className="detail-left">
          {/* Image Gallery */}
          {pkg.images && pkg.images.length > 1 ? (
            <div style={{marginBottom: 24}}>
              <img src={pkg.images[imgIdx]} alt={pkg.title} style={{width:'100%',height:400,objectFit:'cover',borderRadius:12,boxShadow:'0 2px 8px #0001'}} />
              <div style={{display:'flex',gap:8,marginTop:8}}>
                {pkg.images.map((img, i) => (
                  <img key={i} src={img} alt={pkg.title+" thumb"} style={{width:60,height:40,objectFit:'cover',borderRadius:6,border:imgIdx===i?'2px solid #d32f2f':'2px solid #eee',cursor:'pointer'}} onClick={()=>setImgIdx(i)} />
                ))}
              </div>
            </div>
          ) : (
            <img src={pkg.images?.[0] || 'https://via.placeholder.com/800x500'} alt={pkg.title} style={{width:'100%',height:400,objectFit:'cover',borderRadius:12,marginBottom:24,boxShadow:'0 2px 8px #0001'}} />
          )}

          {/* Tabs */}
          <div style={{display:'flex',gap:16,marginBottom:24}}>
            <button onClick={()=>setTab('overview')} style={{padding:'8px 20px',borderRadius:20,border:'none',background:tab==='overview'?'#d32f2f':'#eee',color:tab==='overview'?'#fff':'#333',fontWeight:700,cursor:'pointer'}}>Overview</button>
            <button onClick={()=>setTab('itinerary')} style={{padding:'8px 20px',borderRadius:20,border:'none',background:tab==='itinerary'?'#d32f2f':'#eee',color:tab==='itinerary'?'#fff':'#333',fontWeight:700,cursor:'pointer'}}>Itinerary</button>
            <button onClick={()=>setTab('highlights')} style={{padding:'8px 20px',borderRadius:20,border:'none',background:tab==='highlights'?'#d32f2f':'#eee',color:tab==='highlights'?'#fff':'#333',fontWeight:700,cursor:'pointer'}}>Highlights</button>
          </div>

          {/* Tab Content */}
          {tab==='overview' && (
            <div style={{marginBottom:40}}>
              <h3 style={{borderBottom:'2px solid #f0f0f0',paddingBottom:10,marginBottom:20,color:'#d32f2f'}}>Overview</h3>
              <p style={{lineHeight:1.6,color:'#444',fontSize:16}}>{pkg.summary}</p>
            </div>
          )}
          {tab==='itinerary' && (
            <div style={{marginBottom:40}}>
              <h3 style={{borderBottom:'2px solid #f0f0f0',paddingBottom:10,marginBottom:20,color:'#d32f2f'}}>Itinerary Schedule</h3>
              <div>
                {pkg.itineraryOutline?.map((d,i) => (
                  <div key={i} style={{display:'flex',gap:20,marginBottom:25,borderLeft:'3px solid #eee',paddingLeft:20}}>
                    <div style={{background:'#333',color:'white',padding:'5px 10px',borderRadius:4,height:'fit-content',fontWeight:'bold',fontSize:12,whiteSpace:'nowrap'}}>Day {d.day}</div>
                    <div>
                      <h4 style={{margin:'0 0 5px 0',fontSize:16}}>{d.title}</h4>
                      <p style={{margin:0,fontSize:14,color:'#666'}}>{d.details}</p>
                    </div>
                  </div>
                ))}
                {(!pkg.itineraryOutline || pkg.itineraryOutline.length === 0) && <p>Contact us for full itinerary details.</p>}
              </div>
            </div>
          )}
          {tab==='highlights' && (
            <div style={{marginBottom:40}}>
              <h3 style={{borderBottom:'2px solid #f0f0f0',paddingBottom:10,marginBottom:20,color:'#d32f2f'}}>Highlights</h3>
              <ul style={{paddingLeft:20}}>
                {pkg.highlights?.map((h,i) => <li key={i} style={{fontSize:15,color:'#b71c1c',marginBottom:8}}>{h}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Enquiry Form */}
        <div className="detail-right">
          <div style={{background:'white',padding:25,borderRadius:12,boxShadow:'0 5px 20px rgba(0,0,0,0.12)',border:'1px solid #e0e0e0',position:'sticky',top:20}}>
            <div style={{textAlign:'center',marginBottom:20}}>
              <span style={{display:'block',fontSize:12,color:'#888',textTransform:'uppercase'}}>Deal Price</span>
              <span style={{fontSize:28,fontWeight:800,color:'#d32f2f'}}>₹{pkg.price.toLocaleString()}</span>
              <span style={{fontSize:14,color:'#666'}}> / person</span>
            </div>
            <hr style={{border:0,borderTop:'1px solid #eee',margin:'20px 0'}} />
            <h4 style={{marginTop:0,marginBottom:10}}>Interested in this trip?</h4>
            <p style={{fontSize:13,color:'#666',marginBottom:15}}>Fill the form and our travel experts will call you shortly.</p>
            <EnquiryForm packageId={pkg._id} />
          </div>
        </div>
      </div>
      {/* Related Packages section */}
      {related.length > 0 && (
        <div style={{marginTop:60}}>
          <h2 style={{fontSize:24,marginBottom:24,color:'#d32f2f'}}>Related Packages</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24}}>
            {related.map(rp => (
              <div key={rp._id} style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px #0001',padding:18,display:'flex',flexDirection:'column',alignItems:'start'}}>
                <img src={rp.images?.[0]||'https://via.placeholder.com/400x250?text=No+Image'} alt={rp.title} style={{width:'100%',height:140,objectFit:'cover',borderRadius:8,marginBottom:12}} />
                <h4 style={{fontSize:17,margin:'0 0 8px 0',color:'#222'}}>{rp.title}</h4>
                <div style={{fontSize:13,color:'#666',marginBottom:8}}>{rp.durationDays} Days • ₹{rp.price.toLocaleString()}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {rp.highlights?.slice(0,2).map((h,i)=>(<span key={i} style={{background:'#ffe082',color:'#b71c1c',borderRadius:6,padding:'2px 8px',fontSize:12}}>{h}</span>))}
                </div>
                <a href={`/packages/${rp._id}`} style={{marginTop:'auto',color:'#d32f2f',fontWeight:700,textDecoration:'underline',fontSize:14}}>View Details</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Component: Enquiry Form ---
function EnquiryForm({ packageId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone.replace(/\D/g, ''));

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!name.trim()) return setStatus({ ok: false, msg: 'Name is required.' });
    if (!validateEmail(email)) return setStatus({ ok: false, msg: 'Enter a valid email.' });
    if (!validatePhone(phone)) return setStatus({ ok: false, msg: 'Enter a valid phone number.' });
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, packageId })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || (j.errors && JSON.stringify(j.errors)) || 'Failed');
      setConfirmed(true);
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || 'Submission failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  if (confirmed) {
    return (
      <div aria-live="polite" style={{textAlign:'center',padding:'30px 0'}}>
        <div style={{fontSize:32,marginBottom:10,color:'#43a047'}}>✔</div>
        <div style={{fontSize:18,fontWeight:600,marginBottom:8}}>Thank you for your enquiry!</div>
        <div style={{fontSize:15,color:'#666'}}>Our travel experts will contact you soon.</div>
        <button onClick={()=>{setConfirmed(false);setStatus(null);}} style={{marginTop:20,padding:'10px 24px',borderRadius:6,border:'none',background:'#d32f2f',color:'#fff',fontWeight:700,cursor:'pointer'}}>Send Another Enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-label="Enquiry Form" autoComplete="on" style={{width:'100%'}}>
      <input required aria-label="Your Name" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} autoComplete="name" />
      <input required aria-label="Email Address" type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
      <input required aria-label="Phone Number" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle} autoComplete="tel" />
      <textarea aria-label="Message (Optional)" placeholder="Message (Optional)" value={message} onChange={e=>setMessage(e.target.value)} rows={3} style={{...inputStyle, resize: 'vertical'}} />
      <button 
        type="submit" 
        disabled={loading} 
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'default' : 'pointer',
          marginTop: '5px'
        }}
        aria-busy={loading}
      >
        {loading ? 'Sending...' : 'Send Enquiry Now'}
      </button>
      {status && (
        <div style={{marginTop: 15, fontSize: 14, textAlign: 'center', fontWeight: '500', color: status.ok ? 'green' : 'crimson'}} role="alert">
          {status.msg}
        </div>
      )}
    </form>
  );
}