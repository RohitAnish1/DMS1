import { useState } from 'react';
import { request } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        email: '', password: '', fullName: '', phone: '', role: 'patient'
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
            <div className="card">
                <h2 className="text-2xl text-center mb-4">Create Account</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Full Name</label>
                        <input className="input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Phone</label>
                        <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">I am a</label>
                        <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
            </div>
        </div>
    );
}
