import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const form = new URLSearchParams();
        form.append('username', email);
        form.append('password', password);
        
        try {
            const res = await api.post('/login', form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            localStorage.setItem('token', res.data.access_token);
            setUser({ email });
            return true;
        } catch (error) {
            console.error("Login gagal", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);