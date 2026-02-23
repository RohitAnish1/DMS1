import { useState } from 'react';
import { request } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'patient',
        specialization: '',
        consultationFee: '',
        startTime: '09:00',
        endTime: '17:00'
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const registrationData = {
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                phone: form.phone,
                role: form.role,
                profileData: form.role === 'doctor' ? {
                    specialization: form.specialization,
                    consultationFee: form.consultationFee,
                    startTime: form.startTime,
                    endTime: form.endTime
                } : {}
            };

            await request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(registrationData),
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
            <div className="card shadow-lg" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Create Account</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', border: '1px solid var(--danger)', borderRadius: '4px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Full Name</label>
                            <input className="input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required placeholder="Enter your full name" />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="email@example.com" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Phone</label>
                            <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
                        </div>
                        <div className="form-group">
                            <label className="label">Password</label>
                            <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="********" />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label">I am a</label>
                        <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    {form.role === 'doctor' && (
                        <div className="doctor-fields" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>Doctor Profile Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label className="label">Specialization</label>
                                    <input className="input" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required placeholder="e.g. Cardiologist" />
                                </div>
                                <div className="form-group">
                                    <label className="label">Consultation Fee ($)</label>
                                    <input className="input" type="number" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} required placeholder="e.g. 100" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div className="form-group">
                                    <label className="label">Available From</label>
                                    <input className="input" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="label">Available Until</label>
                                    <input className="input" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
                                </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.5rem' }}>* This will set your default availability for every day of the week.</p>
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: '600', fontSize: '1.125rem' }}>Register</button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ color: '#475569' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
