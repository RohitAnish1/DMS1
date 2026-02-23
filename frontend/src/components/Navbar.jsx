import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Stethoscope, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="container" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>
                <Stethoscope size={28} /> MedSys
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                            <User size={18} /> {user.name} ({user.role})
                        </span>
                        <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
