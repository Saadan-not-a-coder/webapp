import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data.data;
            
            // Save the token and user role to the browser's local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            // Route them to the correct dashboard based on their role
            if (user.role === 'TEACHER') {
                navigate('/teacher-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Login to Quiz Portal</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
                    Login
                </button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a>.</p>
        </div>
    );
}