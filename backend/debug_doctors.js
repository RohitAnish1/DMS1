const db = require('./db');

async function checkDoctorsAndAvailability() {
    try {
        const doctors = await db.query('SELECT d.id, u.full_name FROM doctors d JOIN users u ON d.user_id = u.id');
        console.log('Doctors:', JSON.stringify(doctors.rows, null, 2));

        const availCounts = await db.query(`
        SELECT doctor_id, COUNT(*) as days_active 
        FROM doctor_availability 
        GROUP BY doctor_id
    `);
        console.log('Availability Counts:', JSON.stringify(availCounts.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkDoctorsAndAvailability();
