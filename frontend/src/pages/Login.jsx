import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { request } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h2 className="text-2xl text-center mb-4">Welcome Back</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    <div className="text-center mt-4">
                        <span className="text-muted">No account? </span>
                        <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
