const db = require('./db');

async function checkData() {
    try {
        const doctors = await db.query('SELECT * FROM doctors');
        console.log('Doctors:', JSON.stringify(doctors.rows, null, 2));

        const availability = await db.query('SELECT * FROM doctor_availability');
        console.log('Availability:', JSON.stringify(availability.rows, null, 2));

        // Check if we have any users
        const users = await db.query('SELECT id, role, email FROM users');
        console.log('Users:', JSON.stringify(users.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkData();
