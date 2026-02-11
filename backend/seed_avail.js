const db = require('./db');

async function seedAvailability() {
    try {
        const drs = await db.query('SELECT id FROM doctors');
        if (drs.rows.length === 0) {
            console.log('No doctors found!');
            return;
        }
        const doctorId = drs.rows[0].id;
        console.log('Seeding for Doctor:', doctorId);

        // Add availability for Mon-Fri if not exists
        // We saw Day 1 exists. Let's add 0, 2, 3, 4, 5, 6
        const days = [0, 2, 3, 4, 5, 6];

        for (const d of days) {
            await db.query(
                `INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration, is_active)
             VALUES ($1, $2, '09:00', '17:00', 30, true)`,
                [doctorId, d]
            );
            console.log(`Added availability for day ${d}`);
        }

        console.log('Done.');

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

seedAvailability();
