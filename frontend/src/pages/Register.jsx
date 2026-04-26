import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { email, password, role });
            
            Swal.fire({
                title: 'Account Created!',
                text: 'You can now log in with your credentials.',
                icon: 'success',
                confirmButtonColor: '#111827'
            });
            navigate('/login');
        } catch (error) {
            Swal.fire('Registration Failed', error.response?.data?.message || 'Could not create account.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#0f172a', margin: '0 0 10px 0', fontSize: '28px' }}>Create Account</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Join the Online Quiz Portal.</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                            I am a...
                        </label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                        </select>
                    </div>

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
                            placeholder="Create a strong password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px', fontSize: '16px' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
                </div>
            </div>
        </div>
    );
}