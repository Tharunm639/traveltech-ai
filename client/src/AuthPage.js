import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doAuth = async (path) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: email.split('@')[0] }),
      });
      const j = await res.json();
      if (res.ok) {
        localStorage.setItem('tt_token', j.token);
        localStorage.setItem('tt_user', JSON.stringify(j.user));
        onAuth(j.token, j.user);
        if (j.user && j.user.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        alert('Auth failed: ' + (j.error || JSON.stringify(j)));
      }
    } catch (e) {
      console.error(e);
      alert('Auth error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:480,margin:'24px auto', padding: '20px'}}>
      <h2>Sign In / Register</h2>
      <input 
        placeholder="Email" 
        value={email} 
        onChange={e=>setEmail(e.target.value)} 
        style={{width:'100%',marginBottom:8, padding: '8px'}} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)} 
        style={{width:'100%',marginBottom:8, padding: '8px'}} 
      />
      <div style={{display:'flex',gap:8}}>
        <button 
            onClick={()=>doAuth('login')} 
            disabled={loading}
            style={{padding: '10px 20px', background: '#d32f2f', color: 'white', border: 'none', cursor: 'pointer'}}
        >
            Login
        </button>
        <button 
            onClick={()=>doAuth('register')} 
            disabled={loading}
            style={{padding: '10px 20px', background: '#555', color: 'white', border: 'none', cursor: 'pointer'}}
        >
            Register
        </button>
      </div>
    </div>
  );
}