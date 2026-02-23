const express = require('express');
const router = express.Router();
const db = require('../db');
const { parseISO, format, addMinutes, isBefore, getDay } = require('date-fns');

router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT d.id, d.specialization, d.consultation_fee, u.full_name, u.email 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id/slots', async (req, res) => {
    const { id } = req.params;
    const { date } = req.query; 

    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
        const targetDate = parseISO(date);
        const dow = getDay(targetDate); 

        const availRes = await db.query(
            'SELECT * FROM doctor_availability WHERE doctor_id = $1 AND day_of_week = $2 AND is_active = true',
            [id, dow]
        );

        if (availRes.rows.length === 0) {
            return res.json([]); 
        }

        const { start_time, end_time, slot_duration } = availRes.rows[0];

        const [startH, startM] = start_time.split(':');
        const [endH, endM] = end_time.split(':');

        let currentSlot = new Date(targetDate);
        currentSlot.setHours(parseInt(startH), parseInt(startM), 0, 0);

        const endSlot = new Date(targetDate);
        endSlot.setHours(parseInt(endH), parseInt(endM), 0, 0);

        const dayStart = new Date(targetDate); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate); dayEnd.setHours(23, 59, 59, 999);

        const apptsRes = await db.query(
            `SELECT start_time FROM appointments 
       WHERE doctor_id = $1 AND status != 'cancelled' 
       AND start_time >= $2 AND start_time <= $3`,
            [id, dayStart, dayEnd]
        );

        const bookedTimes = apptsRes.rows.map(a => new Date(a.start_time).toISOString());

        const slots = [];
        while (isBefore(currentSlot, endSlot)) {

            const currentTs = currentSlot.getTime();
            const isBooked = apptsRes.rows.some(a => {
                const bookedStart = new Date(a.start_time).getTime();
                return Math.abs(bookedStart - currentTs) < 1000; 
            });

            if (!isBooked) {
                slots.push(format(currentSlot, 'HH:mm'));
            }

            currentSlot = addMinutes(currentSlot, slot_duration);
        }

        res.json(slots);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
