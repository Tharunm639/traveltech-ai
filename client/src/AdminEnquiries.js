import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function AdminEnquiries({ token }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchEnquiries = async () => {
    if (!token) return;
    try {
      setLoading(true);
      // Connects to your backend API
      const res = await fetch('/api/admin/enquiries', {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to fetch enquiries');
      }
    } catch (e) {
      console.error(e);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="section-container"><h3>Please log in as Admin first.</h3></div>;

  return (
    <div className="section-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
        <h2 className="section-title" style={{marginBottom:0}}>Customer Enquiries</h2>
        <button onClick={fetchEnquiries} style={{padding:'8px 16px', cursor:'pointer'}}>Refresh Data</button>
      </div>

      {error && <p style={{color:'red'}}>{error}</p>}
      
      {loading ? <p>Loading enquiries...</p> : (
        <div style={{overflowX: 'auto', background:'white', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead style={{background:'#f4f4f4', borderBottom:'2px solid #ddd'}}>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Package</th>
                <th style={thStyle}>Message</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 && (
                <tr><td colSpan="5" style={{padding:20, textAlign:'center'}}>No enquiries found yet.</td></tr>
              )}
              {enquiries.map((enq) => (
                <tr key={enq._id} style={{borderBottom:'1px solid #eee'}}>
                  <td style={tdStyle}>
                    {new Date(enq.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}><strong>{enq.name}</strong></td>
                  <td style={tdStyle}>
                    <div>{enq.phone}</div>
                    <a href={`mailto:${enq.email}`} style={{color:'#007bff', fontSize:13}}>{enq.email}</a>
                  </td>
                  <td style={tdStyle}>
                    {enq.package ? (
                      <Link to={`/packages/${enq.package._id}`} style={{fontWeight:'bold', color:'#d32f2f'}}>
                        {enq.package.title}
                      </Link>
                    ) : <span style={{color:'#999'}}>General</span>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{maxWidth:300, fontSize:14, color:'#555'}}>{enq.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px', color: '#555' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'top' };