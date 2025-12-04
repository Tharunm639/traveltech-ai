import React, { useState } from 'react';

export default function EnquiryForm({ title = "Send us an Enquiry" }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            console.log("Enquiry Submitted:", formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        }, 1000);
    };

    return (
        <div style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: 20, color: '#222' }}>{title}</h3>
            {status === 'success' ? (
                <div style={{ color: 'green', textAlign: 'center', padding: 20 }}>
                    <h4>✅ Message Sent!</h4>
                    <p>We'll get back to you shortly.</p>
                    <button onClick={() => setStatus('')} style={{ marginTop: 10, background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', textDecoration: 'underline' }}>Send another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#666', fontSize: 14 }}>Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#666', fontSize: 14 }}>Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#666', fontSize: 14 }}>Message</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        style={{
                            width: '100%', padding: 12, background: '#d32f2f', color: 'white',
                            border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                            opacity: status === 'sending' ? 0.7 : 1
                        }}
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box'
};
