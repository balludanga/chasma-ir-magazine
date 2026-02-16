import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

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

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body; // Password ignored for demo
  
  // Check admin
  // (Simplified: In real app, check env vars or separate admin table)
  if (email === 'admin@chasma.ir') {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
          if (row) return res.json(row);
      });
      return;
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: "Invalid credentials" });
    res.json(row);
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, role } = req.body;
  const id = `user_${Date.now()}`;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
  const joinedAt = new Date().toISOString().split('T')[0];
  
  const stmt = db.prepare("INSERT INTO users (id, name, email, avatar, role, joinedAt, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run(id, name, email, avatar, role, joinedAt, 1, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      res.json(row);
    });
  });
});

// --- Article Routes ---

app.get('/api/articles', (req, res) => {
  const sql = `
    SELECT a.*, u.name as authorName, u.email as authorEmail, u.avatar as authorAvatar, u.role as authorRole, u.bio as authorBio, u.subscribers as authorSubscribers 
    FROM articles a 
    JOIN users u ON a.authorId = u.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const articles = rows.map(formatArticle);
    res.json(articles);
  });
});

app.post('/api/articles', (req, res) => {
  const { title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, tags, status } = req.body;
  const id = `article_${Date.now()}`;
  
  const stmt = db.prepare(`
    INSERT INTO articles (id, title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, likes, tags, status, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0)
  `);
  
  stmt.run(id, title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, JSON.stringify(tags || []), status, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.put('/api/articles/:id', (req, res) => {
  // Simplified update
  const { title, content, status } = req.body;
  const { id } = req.params;
  
  db.run("UPDATE articles SET title = ?, content = ?, status = ? WHERE id = ?", [title, content, status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Updated" });
  });
});

app.delete('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM articles WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted" });
  });
});

// --- User Routes ---

app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Category Routes ---

app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, slug, description, image } = req.body;
  const id = `cat_${Date.now()}`;
  
  const stmt = db.prepare("INSERT INTO categories (id, name, slug, description, image, articleCount, isActive) VALUES (?, ?, ?, ?, ?, 0, 1)");
  stmt.run(id, name, slug, description, image, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// --- Site Settings ---

app.get('/api/settings', (req, res) => {
  db.get("SELECT * FROM site_settings WHERE id = 1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      row.socialLinks = JSON.parse(row.socialLinks || '{}');
      res.json(row);
    } else {
      res.json({});
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
