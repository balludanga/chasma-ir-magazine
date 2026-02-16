import { db } from './database.js';

async function testCreateArticle() {
  console.log('--- Testing Article Creation ---');
  
  const authorId = '1'; // Using existing user ID
  const id = `article_test_${Date.now()}`;
  const title = 'Test Article';
  const content = 'Test Content';
  const category = '1'; // Existing category ID?
  const publishedAt = new Date().toISOString();
  
  try {
    console.log(`Attempting to create article for author ${authorId}...`);
    
    await db`
      INSERT INTO articles (id, title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, likes, tags, status, views)
      VALUES (${id}, ${title}, 'Excerpt', ${content}, 'img.jpg', ${category}, ${authorId}, ${publishedAt}, 5, 0, '[]', 'published', 0)
    `;
    
    console.log('Article created successfully!');
    
    // Verify
    const res = await db`SELECT * FROM articles WHERE id = ${id}`;
    if (res.rows.length > 0) {
      console.log('Verification successful:', res.rows[0]);
      // Cleanup
      await db`DELETE FROM articles WHERE id = ${id}`;
      console.log('Cleanup successful.');
    } else {
      console.error('Verification failed: Article not found.');
    }

  } catch (error) {
    console.error('Creation failed:', error);
  }
  process.exit();
}

testCreateArticle();