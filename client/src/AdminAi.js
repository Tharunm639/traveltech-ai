import React, { useEffect, useState } from 'react';

export default function AdminAi({ token }) {
  const [config, setConfig] = useState({});
  const [override, setOverride] = useState('');
  const [usage, setUsage] = useState([]);

  const headers = () => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/ai/config', { headers: headers() });
      const j = await res.json();
      setConfig(j);
      setOverride(j.model || '');
    } catch (e) { console.error(e); }
  };

  const saveOverride = async () => {
    try {
      const res = await fetch('/api/admin/ai/config', { method: 'POST', headers: headers(), body: JSON.stringify({ overrideModel: override || null }) });
      const j = await res.json();
      if (res.ok) { setConfig({ ...config, model: j.overrideModel }); alert('Saved'); }
      else alert('Error: ' + JSON.stringify(j));
    } catch (e) { console.error(e); alert('Failed'); }
  };

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/admin/ai/usage', { headers: headers() });
      const j = await res.json();
      setUsage(j.docs || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchConfig(); fetchUsage(); }, []);

  return (
    <div style={{padding:20}}>
      <h2>AI Admin</h2>
      <div>
        <strong>Provider:</strong> {config.provider || 'n/a'}<br />
        <strong>Model (effective):</strong> {config.model || process.env.REACT_APP_AI_MODEL || ''}
      </div>
      <div style={{marginTop:12}}>
        <input placeholder="Override model (leave empty to clear)" value={override} onChange={e=>setOverride(e.target.value)} style={{width:400}} />
        <button onClick={saveOverride} style={{marginLeft:8}}>Save Override</button>
      </div>

      <h3 style={{marginTop:20}}>Recent Usage</h3>
      <div>
        {usage.map(u => (
          <div key={u._id} style={{border:'1px solid #eee',padding:8,marginBottom:6}}>
            <div><strong>{u.model}</strong> • {u.provider} • {u.promptLength} chars</div>
            <div style={{fontSize:12,color:'#666'}}>{new Date(u.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
