import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Shield, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container" style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <section style={{
                padding: '5rem 1rem',
                background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
                textAlign: 'center',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        <Stethoscope size={16} /> Empowering Modern Healthcare
                    </div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        color: '#0f172a',
                        lineHeight: 1.2,
                        marginBottom: '1.5rem'
                    }}>
                        Your Health, <span style={{ color: 'var(--primary)' }}>Simplified.</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#475569',
                        marginBottom: '2.5rem',
                        lineHeight: 1.6
                    }}>
                        Book appointments with the best doctors in seconds. Experience a seamless healthcare management system designed for you and your family.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Go to Dashboard <LayoutDashboard size={20} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Get Started <ArrowRight size={20} />
                                </Link>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '3.5rem', color: '#1e293b' }}>Why Choose MedSys?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                        <div className="card shadow-sm" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Calendar size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Easy Booking</h3>
                            <p style={{ color: '#64748b' }}>Schedule your visits in just a few clicks with real-time doctor availability.</p>
                        </div>
                        <div className="card shadow-sm" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Clock size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Instant Updates</h3>
                            <p style={{ color: '#64748b' }}>Get notified immediately about your appointments and status changes.</p>
                        </div>
                        <div className="card shadow-sm" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Shield size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Secure Data</h3>
                            <p style={{ color: '#64748b' }}>Your personal health information is encrypted and protected with us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '5rem 1rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Ready to take the next step?</h2>
                    <p style={{ fontSize: '1.125rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                        Join thousands of patients and doctors who are already using MedSys to manage their healthcare digitally.
                    </p>
                    <Link to={user ? "/dashboard" : "/register"} className="btn" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', padding: '0.75rem 2.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
                        {user ? "View Your Dashboard" : "Create Your Free Account"}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem 1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', marginTop: 'auto' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        <Stethoscope size={20} /> MedSys
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>&copy; 2026 MedSys. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
