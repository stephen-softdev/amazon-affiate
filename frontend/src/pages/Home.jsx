import React, { useEffect, useState } from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';

export default function Home({ api }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, [api]);

  return (
    <div>
      <div className="hero">
        <h1>Handpicked Premium Gear</h1>
        <p>Discover the best products we've curated just for you. From tech gadgets to everyday essentials.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--text-secondary)' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>No products available right now. Check back later!</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.title} className="product-image" />
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="product-action">
                  Get it on Amazon <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
