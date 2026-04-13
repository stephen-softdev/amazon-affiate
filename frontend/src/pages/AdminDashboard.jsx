import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard({ api }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    productUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('adminToken');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/products', formData, authConfig);
      setFormData({ title: '', description: '', imageUrl: '', productUrl: '' });
      fetchProducts();
      setMessage('Product added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error adding product: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`, authConfig);
      fetchProducts();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Add Product Form */}
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add New Affiliate Link
          </h3>
          
          {message && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: message.includes('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: '8px' }}>{message}</div>}

          <form onSubmit={handleAddProduct}>
            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description / Review</label>
              <textarea name="description" className="form-input" value={formData.description} onChange={handleChange} rows="3" required></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="url" name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." required />
            </div>

            <div className="form-group">
              <label className="form-label">Amazon Affiliate URL</label>
              <input type="url" name="productUrl" className="form-input" value={formData.productUrl} onChange={handleChange} placeholder="https://amzn.to/..." required />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Adding...' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Active Products</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {products.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No products published yet.</p>
            ) : (
              products.map(product => (
                <div key={product.id} className="list-item">
                  <div>
                    <div className="list-item-title">{product.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Clicks go to Amazon</div>
                  </div>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger" title="Remove Product">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
