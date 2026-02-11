import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { request } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        if (!user) return;

        request(`/appointments?userId=${user.id}&role=${user.role}`)
            .then(setAppointments)
            .catch(err => console.error(err));

        if (user.role === 'patient') {
            request('/doctors')
                .then(setDoctors)
                .catch(err => console.error(err));
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="container mt-4">
            <h1 className="text-2xl mb-4">Dashboard</h1>

            {user.role === 'patient' && (
                <section className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Available Doctors</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {doctors.map(doc => (
                            <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div>
                                    <h3 className="text-xl" style={{ margin: 0 }}>{doc.full_name}</h3>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500 }}>{doc.specialization}</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                    Consultation Fee: ${doc.consultation_fee}
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                    <Link to={`/book/${doc.id}`} className="btn btn-primary" style={{ width: '100%' }}>Book Appointment</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-4">
                <h2 className="text-xl mb-4">Your Appointments</h2>
                {appointments.length === 0 ? (
                    <div className="card text-center text-muted">No appointments scheduled.</div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Date & Time</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 500 }}>{new Date(app.start_time).toLocaleDateString()}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {user.role === 'patient' ? app.doctor_name : app.patient_name}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                background: app.status === 'cancelled' ? '#fee2e2' : '#d1fae5',
                                                color: app.status === 'cancelled' ? '#991b1b' : '#065f46',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
