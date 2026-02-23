const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;


router.post('/register', async (req, res) => {
    const { email, password, fullName, phone, role, profileData } = req.body;

    if (!email || !password || !fullName || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const userRes = await client.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, true) RETURNING id`,
            [email, hash, fullName, phone, role]
        );
        const userId = userRes.rows[0].id;

        if (role === 'patient') {
            const { dob, gender, address } = profileData || {};
            await client.query(
                'INSERT INTO patients (user_id, dob, gender, address) VALUES ($1, $2, $3, $4)',
                [userId, dob, gender, address]
            );
        } else if (role === 'doctor') {
            const { specialization, consultationFee, startTime, endTime } = profileData || {};
            const docRes = await client.query(
                'INSERT INTO doctors (user_id, specialization, consultation_fee) VALUES ($1, $2, $3) RETURNING id',
                [userId, specialization, consultationFee]
            );
            const doctorId = docRes.rows[0].id;

            const days = [0, 1, 2, 3, 4, 5, 6];
            for (const day of days) {
                await client.query(
                    `INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration, is_active)
                     VALUES ($1, $2, $3, $4, 30, true)`,
                    [doctorId, day, startTime || '09:00', endTime || '17:00']
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'User registered successfully', userId });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error during registration: ' + err.message });
    } finally {
        client.release();
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        let roleId = null;
        if (user.role === 'patient') {
            const pRes = await db.query('SELECT id FROM patients WHERE user_id = $1', [user.id]);
            if (pRes.rows.length > 0) roleId = pRes.rows[0].id;
        } else if (user.role === 'doctor') {
            const dRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [user.id]);
            if (dRes.rows.length > 0) roleId = dRes.rows[0].id;
        }

        const payload = {
            userId: user.id,
            role: user.role,
            email: user.email,
            roleId: roleId
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.full_name, role: user.role, roleId } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
