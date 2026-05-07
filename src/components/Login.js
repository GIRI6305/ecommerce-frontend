import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://ecommerce-platform-pyit.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Connection failed. Check if backend is running.');
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#1e40af' }}>🔐 Login</h2>
      {error && <p style={{ color: 'red', background: '#fee2e2', padding: 10, borderRadius: 8 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={submitBtn} type="submit">Login</button>
      </form>
    </div>
  );
}

const cardStyle = { background: 'white', padding: 40, borderRadius: 12, maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const inputStyle = { display: 'block', width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: 12, background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 10 };

export default Login;
