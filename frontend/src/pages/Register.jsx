import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT'); // Default to Student
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Send the data to your Express backend
            await api.post('/auth/register', { email, password, role });
            
            // If successful, alert the user and send them to the login page
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Register for Quiz Portal</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label><strong>Select your role:</strong></label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        style={{ padding: '8px' }}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Create Account
                </button>
            </form>
            
            <p style={{ marginTop: '15px' }}>
                Already have an account? <a href="/login">Login here</a>.
            </p>
        </div>
    );
}