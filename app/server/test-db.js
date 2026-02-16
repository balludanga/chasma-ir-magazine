import { db } from './database.js';

async function testConnectionAndInsert() {
  console.log('Starting database test...');
  try {
    // 1. Test Connection by querying time
    console.log('1. Testing connection...');
    const timeResult = await db`SELECT NOW()`;
    console.log('Database connection successful. Server time:', timeResult.rows[0].now);

    // 2. Test Table Existence (check users table)
    console.log('2. Checking if users table exists...');
    const tableResult = await db`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `;
    if (tableResult.rows.length > 0) {
      console.log('Users table exists.');
    } else {
      console.error('Users table does NOT exist!');
      // Attempt to initialize if it doesn't exist?
      // For now, just report.
    }

    // 3. Test Insert (Insert a test user)
    const testId = `test_user_${Date.now()}`;
    const testEmail = `test${Date.now()}@example.com`;
    console.log(`3. Attempting to insert test user with ID: ${testId}`);
    
    await db`
      INSERT INTO users (id, name, email, role, joinedAt, isActive) 
      VALUES (${testId}, 'Test User', ${testEmail}, 'reader', '2023-01-01', 1)
    `;
    console.log('Insert operation completed without error.');

    // 4. Verify Insert
    console.log('4. Verifying inserted data...');
    const userResult = await db`SELECT * FROM users WHERE id = ${testId}`;
    if (userResult.rows.length > 0) {
      console.log('Verification successful! Found inserted user:', userResult.rows[0]);
      
      // Cleanup
      await db`DELETE FROM users WHERE id = ${testId}`;
      console.log('Cleanup successful (deleted test user).');
      console.log('RESULT: The local server IS enabled to save data.');
    } else {
      console.error('Verification failed! Could not find inserted user.');
      console.log('RESULT: The local server IS NOT saving data correctly.');
    }

  } catch (error) {
    console.error('Database test failed with error:', error);
    console.log('RESULT: The local server encountered an error while trying to save data.');
  }
  process.exit();
}

testConnectionAndInsert();