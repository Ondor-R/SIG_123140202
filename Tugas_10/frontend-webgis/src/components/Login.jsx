import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/'); 
        } else {
            alert("Login Gagal! Pastikan email dan password benar.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#1e293b' }}>Login Admin</h2>
                <input 
                    type="text" placeholder="Email" value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                />
                <input 
                    type="password" placeholder="Password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ display: 'block', width: '100%', marginBottom: '1.5rem', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
                />
                <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Masuk
                </button>
            </form>
        </div>
    );
};

export default Login;