import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SigMap from './SigMap';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function Dashboard() {
    const { user, logout } = useAuth();
    
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="brand-header">
                    <h1>WebGIS Halte Bandar Lampung</h1>
                    <h2>Reyhan Oktavian Putra | 123140202 | Praktikum 9 SIG</h2>
                </div>
                
                <div className="sidebar-content">
                    <div className={`auth-card ${user ? 'admin-active' : 'public-active'}`}>
                        <div className="auth-header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>Status Akses</h3>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: user ? '#059669' : '#dc2626' }}>
                                    {user ? 'Admin Sistem Aktif' : 'Publik (Hanya Lihat)'}
                                </p>
                            </div>
                        </div>
                        
                        {user ? (
                            <button className="btn-action btn-logout" onClick={logout}>
                                 Logout dari Sistem
                            </button>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button className="btn-action btn-login">
                                     Login sebagai Admin
                                </button>
                            </Link>
                        )}
                    </div>

                    <div className="legend-card">
                        <h3>Legends:</h3>
                        <ul className="legend-list">
                            <li><span className="point brt"></span> Halte BRT</li>
                            <li><span className="point bus"></span> Halte Reguler</li>
                            <li><span className="point angkot"></span> Halte Kota</li>
                        </ul>
                    </div>
                </div>
            </aside>
            
            <main className="map-area">
                <SigMap isAdmin={user} />
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}