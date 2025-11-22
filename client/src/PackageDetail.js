import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        const j = await res.json();
        setPkg(j);
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
      </div>

      <div className="detail-grid">
        
        {/* LEFT COLUMN: Image & Itinerary */}
        <div className="detail-left">
          <img 
            src={pkg.images?.[0] || 'https://via.placeholder.com/800x500'} 
            alt={pkg.title} 
            style={{width: '100%', height: 400, objectFit: 'cover', borderRadius: 12, marginBottom: 30}}
          />
          
          <div style={{marginBottom: 40}}>
            <h3 style={{borderBottom: '2px solid #f0f0f0', paddingBottom: 10, marginBottom: 20, color: '#d32f2f'}}>Overview</h3>
            <p style={{lineHeight: 1.6, color: '#444', fontSize: 16}}>{pkg.summary}</p>
          </div>

          <div style={{marginBottom: 40}}>
            <h3 style={{borderBottom: '2px solid #f0f0f0', paddingBottom: 10, marginBottom: 20, color: '#d32f2f'}}>Itinerary Schedule</h3>
            <div>
              {pkg.itineraryOutline?.map((d, i) => (
                <div key={i} style={{display: 'flex', gap: 20, marginBottom: 25, borderLeft: '3px solid #eee', paddingLeft: 20}}>
                  <div style={{background: '#333', color: 'white', padding: '5px 10px', borderRadius: 4, height: 'fit-content', fontWeight: 'bold', fontSize: 12, whiteSpace: 'nowrap'}}>
                    Day {d.day}
                  </div>
                  <div>
                    <h4 style={{margin: '0 0 5px 0', fontSize: 16}}>{d.title}</h4>
                    <p style={{margin: 0, fontSize: 14, color: '#666'}}>{d.details}</p>
                  </div>
                </div>
              ))}
              {(!pkg.itineraryOutline || pkg.itineraryOutline.length === 0) && <p>Contact us for full itinerary details.</p>}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Enquiry Form */}
        <div className="detail-right">
          <div style={{background: 'white', padding: 25, borderRadius: 12, boxShadow: '0 5px 20px rgba(0,0,0,0.12)', border: '1px solid #e0e0e0', position: 'sticky', top: 20}}>
            
            <div style={{textAlign: 'center', marginBottom: 20}}>
              <span style={{display: 'block', fontSize: 12, color: '#888', textTransform: 'uppercase'}}>Deal Price</span>
              <span style={{fontSize: 28, fontWeight: 800, color: '#d32f2f'}}>₹{pkg.price.toLocaleString()}</span>
              <span style={{fontSize: 14, color: '#666'}}> / person</span>
            </div>
            
            <hr style={{border: 0, borderTop: '1px solid #eee', margin: '20px 0'}} />
            
            <h4 style={{marginTop: 0, marginBottom: 10}}>Interested in this trip?</h4>
            <p style={{fontSize: 13, color: '#666', marginBottom: 15}}>Fill the form and our travel experts will call you shortly.</p>
            
            {/* THIS FORM CONNECTS TO YOUR BACKEND */}
            <EnquiryForm packageId={pkg._id} />
          
          </div>
        </div>

      </div>
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

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // CONNECTS TO DATABASE API
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, packageId })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || (j.errors && JSON.stringify(j.errors)) || 'Failed');
      
      setStatus({ ok: true, msg: 'Enquiry Sent! We will call you shortly.' });
      // Clear form on success
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err) {
      console.error(err);
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

  return (
    <form onSubmit={submit}>
      <input required placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />
      <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
      <input required placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle} />
      <textarea placeholder="Message (Optional)" value={message} onChange={e=>setMessage(e.target.value)} rows={3} style={{...inputStyle, resize: 'vertical'}} />
      
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
      >
        {loading ? 'Sending...' : 'Send Enquiry Now'}
      </button>
      
      {status && (
        <div style={{marginTop: 15, fontSize: 14, textAlign: 'center', fontWeight: '500', color: status.ok ? 'green' : 'crimson'}}>
          {status.msg}
        </div>
      )}
    </form>
  );
}