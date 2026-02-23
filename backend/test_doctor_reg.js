const db = require('./db');

async function testRegistration() {
    try {
        const testUser = {
            email: 'drtest' + Date.now() + '@example.com',
            password: 'Password123',
            fullName: 'Dr. Test Case',
            phone: '1234567890',
            role: 'doctor',
            profileData: {
                specialization: 'Surgery',
                consultationFee: 500,
                startTime: '11:00',
                endTime: '19:00'
            }
        };

        const registrationResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(testUser),
            headers: { 'Content-Type': 'application/json' }
        });

        const regData = await registrationResponse.json();
        console.log('Registration Response:', regData);

        if (regData.userId) {
            // Check doctors table
            const docRes = await db.query('SELECT * FROM doctors WHERE user_id = $1', [regData.userId]);
            console.log('Doctor Record:', docRes.rows[0]);

            const doctorId = docRes.rows[0].id;

            // Check availability table
            const availRes = await db.query('SELECT * FROM doctor_availability WHERE doctor_id = $1', [doctorId]);
            console.log(`Found ${availRes.rows.length} availability records.`);
            if (availRes.rows.length > 0) {
                console.log('First availability record details:', {
                    day: availRes.rows[0].day_of_week,
                    start: availRes.rows[0].start_time,
                    end: availRes.rows[0].end_time
                });
            }
        }

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        process.exit();
    }
}

testRegistration();
