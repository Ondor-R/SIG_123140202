import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MapView from './components/MapView';
import Login from './components/Login';
import api from './services/api';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

const Dashboard = () => {
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        nama: '', kode: '', jenis: 'angkot', kapasitas: 0, latitude: '', longitude: ''
    });

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/halte/', {
                nama: formData.nama, kode: formData.kode, jenis: formData.jenis,
                kapasitas: parseInt(formData.kapasitas),
                latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude)
            });
            alert('Berhasil disimpan!');
            window.location.reload();
        } catch (err) {
            alert('Gagal menyimpan data.');
        }
    };

    return (
        <div className="dashboard-layout">
            <header className="brand-header top-bar">
                <div className="brand-title">
                    <h1>WebGIS Halte Bandar Lampung</h1>
                    <h2>Reyhan Oktavian Putra | 123140202 | Praktikum 9 SIG</h2>
                </div>
                <div className="user-controls">
                    <span className="admin-badge">Admin Sistem Aktif</span>
                    <button onClick={handleLogout} className="btn-action btn-logout top-logout">
                        Logout dari Sistem
                    </button>
                </div>
            </header>

            <div className="main-content">
                <aside className="sidebar form-sidebar">
                    <div className="form-container">
                        <h2 className="section-title">Tambah Fasilitas Baru</h2>
                        <form onSubmit={handleTambah} className="facility-form">
                            <input type="text" placeholder="Nama Halte..." required className="auth-input" onChange={e => setFormData({...formData, nama: e.target.value})} />
                            
                            <div className="input-row">
                                <input type="text" placeholder="Kode" className="auth-input" onChange={e => setFormData({...formData, kode: e.target.value})} />
                                <input type="number" placeholder="Kapasitas" required className="auth-input short-input" onChange={e => setFormData({...formData, kapasitas: e.target.value})} />
                            </div>
                            
                            <select className="auth-input form-select" onChange={e => setFormData({...formData, jenis: e.target.value})}>
                                <option value="angkot">Mikrolet / Angkot</option>
                                <option value="bus">Bus Kota Reguler</option>
                                <option value="brt">BRT Trans</option>
                            </select>
                            
                            <div className="input-row">
                                <input type="number" step="any" placeholder="Latitude (Y)" required className="auth-input" onChange={e => setFormData({...formData, latitude: e.target.value})} />
                                <input type="number" step="any" placeholder="Longitude (X)" required className="auth-input" onChange={e => setFormData({...formData, longitude: e.target.value})} />
                            </div>
                            
                            <button type="submit" className="auth-btn btn-primary">Simpan Data Geospasial</button>
                        </form>
                    </div>

                    <div className="legend-card bottom-legend">
                        <h3>Legend:</h3>
                        <ul className="legend-list">
                            <li><span className="point brt"></span> Halte BRT</li>
                            <li><span className="point bus"></span> Halte Reguler</li>
                            <li><span className="point angkot"></span> Halte Kota (Angkot)</li>
                            <li><span className="point ai-detect"></span> AI Detection</li>
                        </ul>
                    </div>
                </aside>

                <main className="map-area">
                    <MapView isAdmin={true} />
                </main>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}