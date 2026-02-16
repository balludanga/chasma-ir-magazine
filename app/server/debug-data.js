import { db } from './database.js';

async function debugData() {
  console.log('--- Debugging Data State ---');
  
  try {
    // 1. List all users
    console.log('1. Fetching users...');
    const users = await db`SELECT id, name, email FROM users`;
    console.log(`Found ${users.rows.length} users:`);
    users.rows.forEach(u => console.log(` - [${u.id}] ${u.name} (${u.email})`));

    // 2. List all articles
    console.log('\n2. Fetching articles...');
    const articles = await db`SELECT id, title, authorId FROM articles`;
    console.log(`Found ${articles.rows.length} articles:`);
    articles.rows.forEach(a => console.log(` - [${a.id}] ${a.title} (Author: ${a.authorId})`));

    if (users.rows.length === 0) {
      console.error('\nCRITICAL: No users found! Article creation will fail due to foreign key constraint.');
      console.log('Run the seed logic or sign up a new user.');
    }

  } catch (error) {
    console.error('Debug failed:', error);
  }
  process.exit();
}

debugData();