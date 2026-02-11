const db = require('./db');
const { getDay, parseISO } = require('date-fns');

async function debugSlots() {
    try {
        // 1. Get all doctors
        const drs = await db.query('SELECT id, user_id FROM doctors');
        console.log('Doctors Found:', drs.rows.length);

        if (drs.rows.length === 0) return;
        const doctorId = drs.rows[0].id;
        console.log('Checking Doctor ID:', doctorId);

        // 2. Check availability
        const avail = await db.query('SELECT * FROM doctor_availability WHERE doctor_id = $1', [doctorId]);
        console.log('Availability Rules:', JSON.stringify(avail.rows, null, 2));

        // 3. Simulated Request for 2026-02-06
        const dateStr = '2026-02-06';
        const targetDate = parseISO(dateStr);
        const dow = getDay(targetDate);
        console.log(`Checking date: ${dateStr}, Day of Week: ${dow}`);

        const matchingRule = avail.rows.find(r => r.day_of_week === dow);
        console.log('Matching Rule:', matchingRule);

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

debugSlots();
