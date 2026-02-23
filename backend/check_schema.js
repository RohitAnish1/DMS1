const db = require('./db');

async function checkSchema() {
    try {
        console.log('--- doctors table ---');
        const doctorsCols = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'doctors'");
        console.table(doctorsCols.rows);

        console.log('--- doctor_availability table ---');
        const availCols = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'doctor_availability'");
        console.table(availCols.rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchema();
