import React, { useState, useEffect } from 'react';

function CustomerDashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('shop');
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [address, setAddress] = useState('');

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('http://localhost:8081/api/products').then(r => r.json()).then(setProducts);
    fetch('http://localhost:8081/api/cart', { headers }).then(r => r.json()).then(setCart);
    fetch('http://localhost:8081/api/orders/my', { headers }).then(r => r.json()).then(setOrders);
  }, []);

  const addToCart = async (productId) => {
    await fetch('http://localhost:8081/api/cart/add', {
      method: 'POST', headers,
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const res = await fetch('http://localhost:8081/api/cart', { headers });
    setCart(await res.json());
    setMsg('Added to cart!');
    setTimeout(() => setMsg(''), 2000);
  };

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:8081/api/cart/${id}`, { method: 'DELETE', headers });
    const res = await fetch('http://localhost:8081/api/cart', { headers });
    setCart(await res.json());
  };

  const placeOrder = async () => {
    if (!address) { setMsg('Please enter shipping address'); return; }
    await fetch('http://localhost:8081/api/orders/place', {
      method: 'POST', headers,
      body: JSON.stringify({ shippingAddress: address })
    });
    setCart([]);
    setMsg('Order placed successfully!');
    const res = await fetch('http://localhost:8081/api/orders/my', { headers });
    setOrders(await res.json());
    setTab('orders');
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button onClick={() => setTab('shop')} style={tab === 'shop' ? activeTab : tabBtn}>🛍️ Shop ({products.length})</button>
        <button onClick={() => setTab('cart')} style={tab === 'cart' ? activeTab : tabBtn}>🛒 Cart ({cart.length})</button>
        <button onClick={() => setTab('orders')} style={tab === 'orders' ? activeTab : tabBtn}>📦 My Orders ({orders.length})</button>
      </div>

      {msg && <p style={{ background: '#dcfce7', color: 'green', padding: 10, borderRadius: 8, marginBottom: 15 }}>{msg}</p>}

      {tab === 'shop' && (
        <div>
          <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, marginBottom: 20, boxSizing: 'border-box' }}
            placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          {filtered.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No products found. Ask admin to add products.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
            {filtered.map(p => (
              <div key={p.id} style={productCard}>
                <div style={{ background: '#e0e7ff', height: 150, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 15 }}>🛍️</div>
                <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>{p.name}</h3>
                <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 8px' }}>{p.description}</p>
                <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 8px' }}>Category: {p.category}</p>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 20, margin: '0 0 15px' }}>₹{p.price}</p>
                <p style={{ color: p.stock > 0 ? '#64748b' : 'red', fontSize: 13, margin: '0 0 10px' }}>Stock: {p.stock}</p>
                <button onClick={() => addToCart(p.id)} disabled={p.stock === 0}
                  style={{ width: '100%', padding: 10, background: p.stock > 0 ? '#1e40af' : '#94a3b8', color: 'white', border: 'none', borderRadius: 8, cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                  {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'cart' && (
        <div style={cardStyle}>
          <h3>🛒 Your Cart</h3>
          {cart.length === 0 && <p style={{ color: '#64748b' }}>Your cart is empty. Go shop!</p>}
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 15, background: '#f8fafc', borderRadius: 8, marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{item.product?.name}</p>
                <p style={{ margin: 0, color: '#64748b' }}>Qty: {item.quantity} × ₹{item.product?.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#16a34a' }}>₹{item.product?.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div style={{ marginTop: 20, borderTop: '2px solid #e2e8f0', paddingTop: 20 }}>
              <h3>Total: ₹{cartTotal.toFixed(2)}</h3>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, marginBottom: 15, boxSizing: 'border-box' }}
                placeholder="Enter shipping address" value={address} onChange={e => setAddress(e.target.value)} />
              <button onClick={placeOrder} style={{ width: '100%', padding: 15, background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 'bold' }}>
                Place Order ₹{cartTotal.toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div style={cardStyle}>
          <h3>📦 My Orders</h3>
          {orders.length === 0 && <p style={{ color: '#64748b' }}>No orders yet.</p>}
          {orders.map(o => (
            <div key={o.id} style={{ background: '#f8fafc', padding: 15, borderRadius: 8, marginBottom: 15, borderLeft: '4px solid #1e40af' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Order #{o.id}</p>
                <span style={{ padding: '4px 12px', borderRadius: 20, background: o.status === 'DELIVERED' ? '#dcfce7' : o.status === 'CANCELLED' ? '#fee2e2' : '#fef9c3', color: o.status === 'DELIVERED' ? '#16a34a' : o.status === 'CANCELLED' ? '#dc2626' : '#854d0e', fontWeight: 'bold', fontSize: 13 }}>{o.status}</span>
              </div>
              <p style={{ margin: '8px 0 4px', color: '#64748b' }}>Date: {new Date(o.orderDate).toLocaleDateString()}</p>
              <p style={{ margin: '4px 0', color: '#64748b' }}>Ship to: {o.shippingAddress}</p>
              <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#16a34a', fontSize: 18 }}>Total: ₹{o.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const productCard = { background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' };
const tabBtn = { padding: '10px 20px', background: '#e2e8f0', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' };
const activeTab = { ...tabBtn, background: '#1e40af', color: 'white' };

export default CustomerDashboard;
