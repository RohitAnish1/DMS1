const db = require('./db');

async function checkEnum() {
    try {
        const res = await db.query(`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'appointment_status';
    `);
        console.log('Valid ENUM values for appointment_status:', res.rows.map(r => r.enumlabel));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkEnum();
