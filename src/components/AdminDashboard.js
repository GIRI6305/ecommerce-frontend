import React, { useState, useEffect } from 'react';

function AdminDashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [msg, setMsg] = useState('');

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadProducts = async () => {
    try {
      const res = await fetch('https://ecommerce-platform-pyit.onrender.com/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('https://ecommerce-platform-pyit.onrender.com/api/orders/admin/all', { headers });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://ecommerce-platform-pyit.onrender.com/api/products/admin', {
        method: 'POST', headers,
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
      });
      setMsg('Product added successfully!');
      setForm({ name: '', description: '', price: '', stock: '', category: '' });
      await loadProducts();
      setTab('products');
    } catch { setMsg('Failed to add product.'); }
    setTimeout(() => setMsg(''), 2000);
  };

  const deleteProduct = async (id) => {
    await fetch(`https://ecommerce-platform-pyit.onrender.com/api/products/admin/${id}`, { method: 'DELETE', headers });
    await loadProducts();
    setMsg('Product deleted!');
    setTimeout(() => setMsg(''), 2000);
  };

  const updateOrderStatus = async (id, status) => {
    await fetch(`https://ecommerce-platform-pyit.onrender.com/api/orders/admin/${id}/status?status=${status}`, { method: 'PUT', headers });
    await loadOrders();
    setMsg('Order status updated!');
    setTimeout(() => setMsg(''), 2000);
  };

  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 25 }}>
        <div style={statCard}><p style={{ margin: 0, color: '#64748b' }}>Total Products</p><h2 style={{ margin: '5px 0 0', color: '#1e40af' }}>{products.length}</h2></div>
        <div style={statCard}><p style={{ margin: 0, color: '#64748b' }}>Total Orders</p><h2 style={{ margin: '5px 0 0', color: '#1e40af' }}>{orders.length}</h2></div>
        <div style={statCard}><p style={{ margin: 0, color: '#64748b' }}>Total Revenue</p><h2 style={{ margin: '5px 0 0', color: '#16a34a' }}>₹{totalRevenue.toFixed(2)}</h2></div>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button onClick={() => setTab('products')} style={tab === 'products' ? activeTab : tabBtn}>📦 Products ({products.length})</button>
        <button onClick={() => setTab('add')} style={tab === 'add' ? activeTab : tabBtn}>➕ Add Product</button>
        <button onClick={() => { setTab('orders'); loadOrders(); }} style={tab === 'orders' ? activeTab : tabBtn}>🧾 All Orders ({orders.length})</button>
      </div>

      {msg && <p style={{ background: '#dcfce7', color: 'green', padding: 10, borderRadius: 8, marginBottom: 15 }}>{msg}</p>}

      {tab === 'products' && (
        <div style={cardStyle}>
          <h3>All Products</h3>
          {products.length === 0 && <p style={{ color: '#64748b' }}>No products yet. Add some!</p>}
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 15, background: '#f8fafc', borderRadius: 8, marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</p>
                <p style={{ margin: '4px 0', color: '#64748b', fontSize: 14 }}>{p.category} | Stock: {p.stock}</p>
                <p style={{ margin: 0, color: '#16a34a', fontWeight: 'bold' }}>₹{p.price}</p>
              </div>
              <button onClick={() => deleteProduct(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'add' && (
        <div style={cardStyle}>
          <h3>Add New Product</h3>
          <form onSubmit={addProduct}>
            <input style={inputStyle} placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={inputStyle} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <input style={inputStyle} type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input style={inputStyle} type="number" placeholder="Stock Quantity" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
            <input style={inputStyle} placeholder="Category (Electronics, Clothing...)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            <button style={submitBtn} type="submit">Add Product</button>
          </form>
        </div>
      )}

      {tab === 'orders' && (
        <div style={cardStyle}>
          <h3>All Orders</h3>
          {orders.length === 0 && <p style={{ color: '#64748b' }}>No orders yet.</p>}
          {orders.map(o => (
            <div key={o.id} style={{ background: '#f8fafc', padding: 15, borderRadius: 8, marginBottom: 15, borderLeft: '4px solid #1e40af' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Order #{o.id} — {o.user?.name}</p>
                  <p style={{ margin: '4px 0', color: '#64748b', fontSize: 14 }}>Ship to: {o.shippingAddress}</p>
                  <p style={{ margin: '4px 0', color: '#16a34a', fontWeight: 'bold' }}>₹{o.totalAmount}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, background: '#fef9c3', color: '#854d0e', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>{o.status}</span>
                  <select onChange={e => updateOrderStatus(o.id, e.target.value)} defaultValue={o.status}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const statCard = { background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' };
const inputStyle = { display: 'block', width: '100%', padding: 12, margin: '10px 0', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: 12, background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 10 };
const tabBtn = { padding: '10px 20px', background: '#e2e8f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' };
const activeTab = { ...tabBtn, background: '#1e40af', color: 'white' };

export default AdminDashboard;
