import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sql, initializeDatabase } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize database on startup
initializeDatabase().catch(console.error);

// Helper to format article
const formatArticle = (row) => ({
  ...row,
  author: {
    id: row.authorId,
    name: row.authorName,
    email: row.authorEmail,
    avatar: row.authorAvatar,
    role: row.authorRole,
    bio: row.authorBio,
    subscribers: row.authorSubscribers
  },
  tags: JSON.parse(row.tags || '[]'),
  comments: [], // Comments loaded separately usually, or via join
  likes: row.likes || 0
});

// --- Auth Routes ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body; // Password ignored for demo
  
  try {
    // Check admin
    if (email === 'admin@chasma.ir') {
        const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (rows.length > 0) return res.json(rows[0]);
    }

    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, role } = req.body;
  const id = `user_${Date.now()}`;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
  const joinedAt = new Date().toISOString().split('T')[0];
  
  try {
    await sql`INSERT INTO users (id, name, email, avatar, role, joinedAt, isActive) VALUES (${id}, ${name}, ${email}, ${avatar}, ${role}, ${joinedAt}, 1)`;
    
    const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Article Routes ---

app.get('/api/articles', async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT a.*, u.name as authorName, u.email as authorEmail, u.avatar as authorAvatar, u.role as authorRole, u.bio as authorBio, u.subscribers as authorSubscribers 
      FROM articles a 
      JOIN users u ON a.authorId = u.id
    `;
    const articles = rows.map(formatArticle);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  const { title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, tags, status } = req.body;
  const id = `article_${Date.now()}`;
  
  try {
    await sql`
      INSERT INTO articles (id, title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, likes, tags, status, views)
      VALUES (${id}, ${title}, ${excerpt}, ${content}, ${coverImage}, ${category}, ${authorId}, ${publishedAt}, ${readTime}, 0, ${JSON.stringify(tags || [])}, ${status}, 0)
    `;
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  // Simplified update
  const { title, content, status } = req.body;
  const { id } = req.params;
  
  try {
    await sql`UPDATE articles SET title = ${title}, content = ${content}, status = ${status} WHERE id = ${id}`;
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM articles WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- User Routes ---

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM users`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Category Routes ---

app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM categories`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, slug, description, image } = req.body;
  const id = `cat_${Date.now()}`;
  
  try {
    await sql`INSERT INTO categories (id, name, slug, description, image, articleCount, isActive) VALUES (${id}, ${name}, ${slug}, ${description}, ${image}, 0, 1)`;
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Site Settings ---

app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await sql`SELECT * FROM site_settings WHERE id = 1`;
    if (rows.length > 0) {
      const row = rows[0];
      row.socialLinks = JSON.parse(row.socialLinks || '{}');
      res.json(row);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

