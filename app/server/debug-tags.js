import { db } from './database.js';

async function debugTags() {
  console.log('--- Debugging Tags Column ---');
  
  try {
    const articles = await db`SELECT id, title, tags FROM articles`;
    console.log(`Found ${articles.rows.length} articles.`);
    
    articles.rows.forEach(a => {
      console.log(`\nArticle [${a.id}]: ${a.title}`);
      console.log(`Raw tags value: '${a.tags}'`);
      try {
        const parsed = JSON.parse(a.tags || '[]');
        console.log('Parsed tags:', parsed);
      } catch (e) {
        console.error('JSON.parse FAILED:', e.message);
      }
    });

  } catch (error) {
    console.error('Debug failed:', error);
  }
  process.exit();
}

debugTags();