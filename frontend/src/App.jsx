import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Users, LogOut, LogIn } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export default function App() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    // Increment and fetch visitor count securely
    api.post('/analytics/hit').then(res => {
      setVisitorCount(res.data.count);
    }).catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="brand">AffiliatesPro</Link>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/admin">Dashboard</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <LogOut size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Logout
                </a>
              </>
            ) : (
              <Link to="/login">
                <LogIn size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Admin IP
              </Link>
            )}
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home api={api} />} />
            <Route path="/login" element={<Login api={api} setAuth={setIsAuthenticated} />} />
            <Route path="/admin" element={isAuthenticated ? <AdminDashboard api={api} /> : <Login api={api} setAuth={setIsAuthenticated} />} />
          </Routes>
        </main>

        <footer>
          <div className="visitor-badge">
            <Users size={18} />
            {visitorCount.toLocaleString()} Happy Visitors
          </div>
          <p>© {new Date().getFullYear()} AffiliatesPro. Premium Amazon Recommendations.</p>
        </footer>
      </div>
    </Router>
  );
}
