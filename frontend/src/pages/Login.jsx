import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Adjust the endpoint if yours is named differently!
            const res = await api.post('/auth/login', { email, password });
            
            // Assuming your backend returns a token and the user's role
            localStorage.setItem('token', res.data.token);
            const userRole = res.data.user.role; 

            Swal.fire({
                title: 'Welcome Back!',
                text: 'Successfully logged in.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            if (userRole === 'TEACHER') {
                navigate('/teacher-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (error) {
            Swal.fire('Login Failed', error.response?.data?.message || 'Invalid credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            {/* Notice how we are using the 'card' class from App.css now! */}
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#0f172a', margin: '0 0 10px 0', fontSize: '28px' }}>Welcome Back</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Log in to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Notice the 'btn-primary' class */}
                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px', fontSize: '16px' }}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
}