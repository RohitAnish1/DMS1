import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Booking() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            request(`/doctors/${id}/slots?date=${selectedDate}`)
                .then(setSlots)
                .catch(err => setError(err.message));
        }
    }, [id, selectedDate]);

    const handleBook = async () => {
        if (!selectedSlot || !reason) {
            setError('Please select a slot and provide a reason');
            return;
        }

        try {
            await request('/appointments/book', {
                method: 'POST',
                body: JSON.stringify({
                    doctorId: id,
                    patientId: user.roleId, // Assuming we stored roleId in auth
                    date: selectedDate,
                    time: selectedSlot,
                    reason
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '600px' }}>
            <div className="card">
                <h2 className="text-2xl mb-4">Book Appointment</h2>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                <div className="form-group">
                    <label className="label">Select Date</label>
                    <input
                        type="date"
                        className="input"
                        value={selectedDate}
                        onChange={e => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot(null);
                        }}
                        min={format(new Date(), 'yyyy-MM-dd')}
                    />
                </div>

                <div className="form-group">
                    <label className="label">Available Slots</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                        {slots.length === 0 ? <p className="text-muted col-span-4">No slots available</p> :
                            slots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius)',
                                        border: selectedSlot === slot ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: selectedSlot === slot ? 'var(--primary)' : 'white',
                                        color: selectedSlot === slot ? 'white' : 'var(--text-main)'
                                    }}
                                >
                                    {slot}
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">Reason for Visit</label>
                    <textarea
                        className="input"
                        rows="3"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Describe your symptoms..."
                    ></textarea>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={handleBook}
                    disabled={!selectedSlot}
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}
