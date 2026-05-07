import React, { useState } from 'react';

function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: 'CUSTOMER' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const response = await fetch('https://ecommerce-platform-pyit.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const text = await response.text();
      const data = JSON.parse(text);
      if (response.ok && data.message) {
        setMsg('Registered successfully! Redirecting to login...');
        setTimeout(onRegister, 2000);
      } else {
        setError(data.message || 'Registration failed. Email may already exist.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#1e40af' }}>📝 Register</h2>
      {msg && <p style={{ color: 'green', background: '#dcfce7', padding: 10, borderRadius: 8 }}>{msg}</p>}
      {error && <p style={{ color: 'red', background: '#fee2e2', padding: 10, borderRadius: 8 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input style={inputStyle} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input style={inputStyle} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input style={inputStyle} name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <button style={submitBtn} type="submit">Register</button>
      </form>
    </div>
  );
}

const cardStyle = { background: 'white', padding: 40, borderRadius: 12, maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const inputStyle = { display: 'block', width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: 12, background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 10 };

export default Register;
