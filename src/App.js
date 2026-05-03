import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage(userData.role === 'ADMIN' ? 'admin' : 'customer');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
    localStorage.removeItem('token');
  };

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e40af', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setPage('home')}>🛒 ShopEasy</h2>
        <div>
          {!user && <button onClick={() => setPage('login')} style={btnStyle}>Login</button>}
          {!user && <button onClick={() => setPage('register')} style={btnStyle}>Register</button>}
          {user && <span style={{ marginRight: 20 }}>Welcome, {user.name}</span>}
          {user && <button onClick={handleLogout} style={btnStyle}>Logout</button>}
        </div>
      </nav>
      <div style={{ padding: '30px' }}>
        {page === 'home' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1 style={{ color: '#1e40af', fontSize: 48 }}>Welcome to ShopEasy</h1>
            <p style={{ fontSize: 20, color: '#64748b' }}>Your one stop shop for everything</p>
            <button onClick={() => setPage('login')} style={{ padding: '15px 40px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 10, fontSize: 18, cursor: 'pointer', marginTop: 20 }}>Shop Now</button>
          </div>
        )}
        {page === 'login' && <Login onLogin={handleLogin} />}
        {page === 'register' && <Register onRegister={() => setPage('login')} />}
        {page === 'customer' && <CustomerDashboard token={user?.token} />}
        {page === 'admin' && <AdminDashboard token={user?.token} />}
      </div>
    </div>
  );
}

const btnStyle = { marginLeft: 10, padding: '8px 16px', background: 'white', color: '#1e40af', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' };

export default App;
