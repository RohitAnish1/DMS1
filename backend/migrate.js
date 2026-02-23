const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbUrl = process.argv[2] || process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('Error: Please provide your database URL as an argument.');
    console.error('Example: node migrate.js "postgres://user:pass@host/db"');
    process.exit(1);
}

async function runMigration() {
    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to the database successfully.');

        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing schema.sql...');
        await client.query(sql);

        console.log('Schema migration completed successfully! All tables created.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

runMigration();
