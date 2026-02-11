const db = require('./db');

async function seedAllDoctors() {
    try {
        // Get all doctors
        const drs = await db.query('SELECT id FROM doctors');
        console.log(`Found ${drs.rows.length} doctors.`);

        const days = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat

        for (const doc of drs.rows) {
            console.log(`Processing doctor ${doc.id}...`);

            for (const d of days) {
                // Check if exists
                const check = await db.query(
                    'SELECT id FROM doctor_availability WHERE doctor_id = $1 AND day_of_week = $2',
                    [doc.id, d]
                );

                if (check.rows.length === 0) {
                    await db.query(
                        `INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration, is_active)
                     VALUES ($1, $2, '09:00', '17:00', 30, true)`,
                        [doc.id, d]
                    );
                    console.log(`  -> Added availability for day ${d}`);
                } else {
                    console.log(`  -> Day ${d} already exists`);
                }
            }
        }
        console.log('Seeding complete.');

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

seedAllDoctors();
