const express = require('express');
const router = express.Router();
const db = require('../db');
const { parseISO, addMinutes, getDay } = require('date-fns');

// Book Appointment
router.post('/book', async (req, res) => {
    const { doctorId, patientId, date, time, reason } = req.body;
    // date: YYYY-MM-DD, time: HH:mm

    if (!doctorId || !patientId || !date || !time) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const startTimeStr = `${date}T${time}:00`;
        const startTimestamp = new Date(startTimeStr);
        const dow = getDay(startTimestamp);

        // 1. Get slot duration and validate doctor works today
        const availRes = await client.query(
            'SELECT slot_duration FROM doctor_availability WHERE doctor_id = $1 AND day_of_week = $2 AND is_active = true',
            [doctorId, dow]
        );

        if (availRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "Doctor not available on this day" });
        }

        const duration = availRes.rows[0].slot_duration;
        const endTimestamp = addMinutes(startTimestamp, duration);

        // 2. Check for overlap - Lock the rows
        // We lock any appointment that overlaps. If we find any, we abort.
        const conflictRes = await client.query(
            `SELECT id FROM appointments 
         WHERE doctor_id = $1 
         AND status != 'cancelled'
         AND (
           (start_time <= $2 AND end_time > $2) OR
           (start_time < $3 AND end_time >= $3) OR
           (start_time >= $2 AND end_time <= $3)
         ) FOR UPDATE`,
            [doctorId, startTimestamp, endTimestamp]
        );

        if (conflictRes.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Slot already booked' });
        }

        // 3. Insert
        await client.query(
            `INSERT INTO appointments (doctor_id, patient_id, start_time, end_time, reason, status, created_at)
        VALUES ($1, $2, $3, $4, $5, 'scheduled', NOW())`,
            [doctorId, patientId, startTimestamp, endTimestamp, reason]
        );

        await client.query('COMMIT');
        res.json({ message: 'Appointment booked successfully' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Booking error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Get Appointments for a user (patient or doctor)
router.get('/', async (req, res) => {
    const { userId, role } = req.query;
    // Secure logic would extract this from JWT middleware 'req.user'

    try {
        let query = '';
        let params = [];

        if (role === 'doctor') {
            // Need doctor_id from userId
            const dRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
            if (dRes.rows.length === 0) return res.json([]);
            query = `SELECT a.*, u.full_name as patient_name 
                     FROM appointments a 
                     JOIN patients p ON a.patient_id = p.id 
                     JOIN users u ON p.user_id = u.id
                     WHERE a.doctor_id = $1 ORDER BY a.start_time`;
            params = [dRes.rows[0].id];
        } else {
            // Need patient_id
            const pRes = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
            if (pRes.rows.length === 0) return res.json([]);
            query = `SELECT a.*, u.full_name as doctor_name 
                     FROM appointments a 
                     JOIN doctors d ON a.doctor_id = d.id 
                     JOIN users u ON d.user_id = u.id
                     WHERE a.patient_id = $1 ORDER BY a.start_time`;
            params = [pRes.rows[0].id];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
