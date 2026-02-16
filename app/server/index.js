import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { db, initializeDatabase } from './database.js';
import { handleUpload } from '@vercel/blob/client';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Vercel)
const PORT = 3001;

// Allow all origins for now to fix Vercel deployment issues
app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for memory storage (store in DB)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit (Vercel has 4.5MB payload limit)
});

// Initialize database on startup
initializeDatabase().catch(console.error);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
    console.log('Upload request received');
    
    // Check if using Vercel Blob client upload (multipart request without file usually means client upload token request or different flow)
    // But here we implement server-side upload to Blob for simplicity if client upload is not used.
    // However, to support big files > 4.5MB on Vercel, we should encourage client uploads.
    // For now, let's modify this endpoint to upload to Vercel Blob instead of DB.

    if (!req.file) {
      console.error('No file in request. Headers:', req.headers);
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Check if Vercel Blob token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.warn('BLOB_READ_WRITE_TOKEN not found, falling back to database storage.');
        // Fallback to existing DB storage logic
        return uploadToDatabase(req, res);
    }

    try {
        const file = req.file;
        let buffer = file.buffer;
        let filename = file.originalname;
        let contentType = file.mimetype;

        // Optional: Optimize images before uploading to Blob to save bandwidth/storage
        if (contentType.startsWith('image/')) {
            try {
                buffer = await sharp(file.buffer)
                  .resize({ width: 1200, withoutEnlargement: true })
                  .webp({ quality: 80 })
                  .toBuffer();
                contentType = 'image/webp';
                filename = filename.replace(/\.[^/.]+$/, "") + ".webp";
                console.log(`Image compressed for Blob. New size: ${buffer.length}`);
            } catch (e) {
                console.warn('Sharp optimization failed, uploading original file to Blob');
            }
        }

        // Upload to Vercel Blob
        const blob = await put(filename, buffer, {
            access: 'public',
            contentType: contentType
        });

        console.log('File uploaded to Vercel Blob:', blob.url);
        res.json({ url: blob.url });
    } catch (error) {
        console.error('Vercel Blob upload error:', error);
        // Fallback to DB if Blob fails? Or just error.
        // Let's error for now to avoid confusion.
        res.status(500).json({ error: 'Failed to upload file to cloud storage: ' + error.message });
    }
});

// Helper for DB upload (legacy fallback)
async function uploadToDatabase(req, res) {
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let filename = req.file.originalname;
    let mimetype = req.file.mimetype;
    let buffer = req.file.buffer; // Buffer data
  
    try {
      console.log(`Processing file for DB: ${filename}, size: ${buffer.length}, type: ${mimetype}`);

      // Process image to reduce size
      if (mimetype.startsWith('image/')) {
        try {
            buffer = await sharp(req.file.buffer)
              .resize({ width: 1200, withoutEnlargement: true }) // Limit width to 1200px
              .webp({ quality: 80 }) // Convert to WebP with 80% quality (great compression)
              .toBuffer();
            
            mimetype = 'image/webp';
            filename = filename.replace(/\.[^/.]+$/, "") + ".webp";
            console.log(`Image compressed. New size: ${buffer.length}, type: ${mimetype}`);
        } catch (sharpError) {
            console.error('Sharp processing failed, falling back to original file:', sharpError);
            // Fallback to original buffer if sharp fails (e.g. missing binaries on Vercel)
        }
      }

      // Convert buffer to hex string for Postgres BYTEA to avoid JSON serialization issues
      // This ensures the data is stored as raw bytes, not as a JSON string
      const hexBuffer = '\\x' + buffer.toString('hex');

      // Store in Postgres
      await db`
        INSERT INTO files (id, filename, mimetype, data, createdAt)
        VALUES (${id}, ${filename}, ${mimetype}, ${hexBuffer}, ${new Date().toISOString()})
      `;
      
      // Return URL that serves from DB
      // Use relative path if possible, or absolute URL
      // Vercel might be on https, so req.protocol helps.
      // Note: req.get('host') on Vercel is the domain.
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const fileUrl = `${protocol}://${host}/api/files/${id}`;
      
      console.log('File saved successfully to DB:', fileUrl);
      res.json({ url: fileUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to save file to database: ' + error.message });
    }
}

app.get(['/api/files/:id', '/files/:id'], async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db`SELECT * FROM files WHERE id = ${id}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const file = rows[0];
    
    let fileData = file.data;
    
    // Check if data is a JSON-serialized buffer (fix for ORB blocking issue)
    if (Buffer.isBuffer(fileData)) {
        const start = fileData.slice(0, 10).toString();
        if (start.startsWith('{"data":[')) {
            try {
                const json = JSON.parse(fileData.toString());
                if (json.data && Array.isArray(json.data)) {
                    fileData = Buffer.from(json.data);
                }
            } catch (e) {
                console.error('Failed to parse JSON buffer:', e);
            }
        }
    }

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Fix ORB blocking
    res.send(fileData); // Send buffer
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

app.get('/api/debug/recent-files', async (req, res) => {
  try {
    const { rows } = await db`
      SELECT id, filename, mimetype, length(data) as size, createdAt 
      FROM files 
      ORDER BY createdAt DESC 
      LIMIT 5
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to format article
const formatArticle = (row) => {
  // Handle both camelCase (if manually constructed) and lowercase (from DB driver) keys
  const id = row.id;
  const authorId = row.authorId || row.authorid;
  const authorName = row.authorName || row.authorname;
  const authorEmail = row.authorEmail || row.authoremail;
  const authorAvatar = row.authorAvatar || row.authoravatar;
  const authorRole = row.authorRole || row.authorrole;
  const authorBio = row.authorBio || row.authorbio;
  const authorSubscribers = row.authorSubscribers || row.authorsubscribers;
  
  // Map fields that might be lowercase from DB
  const coverImage = row.coverImage || row.coverimage;
  const readTime = row.readTime || row.readtime;
  const publishedAt = row.publishedAt || row.publishedat;

  const tagsVal = row.tags;
  const likes = row.likes || 0;
  const featured = row.featured === 1 || row.featured === true;

  // console.log('Parsing tags for article:', id, 'Tags value:', tagsVal);
  
  return {
    ...row,
    id,
    coverImage, // Explicitly mapped
    readTime,   // Explicitly mapped
    publishedAt, // Explicitly mapped
    author: {
      id: authorId,
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      role: authorRole,
      bio: authorBio,
      subscribers: authorSubscribers
    },
    tags: typeof tagsVal === 'string' ? JSON.parse(tagsVal || '[]') : (tagsVal || []),
    comments: [], 
    likes,
    featured
  };
};

// --- Auth Routes ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body; // Password ignored for demo
  
  try {
    // Check admin
    if (email === 'admin@chasma.ir') {
        const { rows } = await db`SELECT * FROM users WHERE email = ${email}`;
        if (rows.length > 0) return res.json(rows[0]);
    }

    const { rows } = await db`SELECT * FROM users WHERE email = ${email}`;
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
    await db`INSERT INTO users (id, name, email, avatar, role, joinedAt, isActive) VALUES (${id}, ${name}, ${email}, ${avatar}, ${role}, ${joinedAt}, 1)`;
    
    const { rows } = await db`SELECT * FROM users WHERE id = ${id}`;
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Article Routes ---

app.get('/api/articles', async (req, res) => {
  try {
    const { rows } = await db`
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
  console.log('Received request to create article');
  const { title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, tags, status, featured } = req.body;
  const id = `article_${Date.now()}`;
  
  try {
    await db`
      INSERT INTO articles (id, title, excerpt, content, coverImage, category, authorId, publishedAt, readTime, likes, tags, status, views, featured)
      VALUES (${id}, ${title}, ${excerpt}, ${content}, ${coverImage}, ${category}, ${authorId}, ${publishedAt}, ${readTime}, 0, ${JSON.stringify(tags || [])}, ${status}, 0, ${featured ? 1 : 0})
    `;
    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  
  try {
    const { rows } = await db`SELECT * FROM articles WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: "Article not found" });
    const existing = rows[0];

    const updated = { ...existing, ...body };
    
    // Ensure featured is integer
    if (body.featured !== undefined) updated.featured = body.featured ? 1 : 0;
    
    await db`
      UPDATE articles 
      SET title = ${updated.title}, 
          excerpt = ${updated.excerpt},
          content = ${updated.content}, 
          coverImage = ${updated.coverImage},
          category = ${updated.category},
          readTime = ${updated.readTime},
          status = ${updated.status},
          publishedAt = ${updated.publishedAt},
          featured = ${updated.featured}
      WHERE id = ${id}
    `;
    res.json({ message: "Updated" });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`DELETE FROM articles WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- User Routes ---

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await db`SELECT * FROM users`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  
  try {
    const { rows } = await db`SELECT * FROM users WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    const existing = rows[0];

    // Merge updates
    const updated = { ...existing, ...body };
    if (body.isActive !== undefined) updated.isActive = body.isActive ? 1 : 0;
    
    // Ensure nullable fields are handled
    const bio = updated.bio || null;
    const avatar = updated.avatar || null;

    await db`UPDATE users SET 
      name = ${updated.name}, 
      role = ${updated.role}, 
      bio = ${bio}, 
      avatar = ${avatar},
      isActive = ${updated.isActive} 
      WHERE id = ${id}`;

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Writer Request Routes ---

app.post('/api/writer-requests', upload.single('biodata'), async (req, res) => {
  const { userId, answers, demoContent } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const id = `req_${Date.now()}`;
  const status = 'pending';
  const requestedAt = new Date().toISOString();
  let biodataUrl = null;

  try {
    // Check if request already exists
    const { rows: existing } = await db`SELECT * FROM writer_requests WHERE userId = ${userId} AND status = 'pending'`;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Request already pending' });
    }

    // Handle Biodata Upload
    if (req.file) {
      // For simplicity in this demo, we'll store small files in DB like images if no blob token
      // Ideally should be S3/Blob.
      // Reuse existing file table logic or upload directly
      // Since `upload` middleware is memoryStorage, we have the buffer.
      
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const filename = req.file.originalname;
      const mimetype = req.file.mimetype;
      const buffer = req.file.buffer;

      // Store in 'files' table
      await db`
        INSERT INTO files (id, filename, mimetype, data, createdAt)
        VALUES (${fileId}, ${filename}, ${mimetype}, ${buffer}, ${new Date().toISOString()})
      `;
      
      // Construct URL (assuming /api/files/:id serves it)
      // We need to ensure we have a route to serve files.
      // The current index.js doesn't seem to have a GET /api/files/:id route visible in the snippet.
      // I should add one.
      biodataUrl = `/api/files/${fileId}`;
    }

    await db`
      INSERT INTO writer_requests (id, userId, status, requestedAt, biodataUrl, questionAnswers, demoContent) 
      VALUES (${id}, ${userId}, ${status}, ${requestedAt}, ${biodataUrl}, ${answers}, ${demoContent})
    `;
    
    res.json({ id, userId, status, requestedAt });
  } catch (error) {
    console.error('Writer request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve files from DB
app.get('/api/files/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db`SELECT * FROM files WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).send('File not found');
    
    const file = rows[0];
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.send(file.data);
  } catch (error) {
    res.status(500).send('Error retrieving file');
  }
});

app.get('/api/writer-requests', async (req, res) => {
  try {
    const { rows } = await db`
      SELECT r.*, u.name as userName, u.email as userEmail, u.avatar as userAvatar
      FROM writer_requests r
      JOIN users u ON r.userId = u.id
      ORDER BY r.requestedAt DESC
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Category Routes ---

app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await db`SELECT * FROM categories`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, slug, description, image } = req.body;
  const id = `cat_${Date.now()}`;
  
  try {
    await db`INSERT INTO categories (id, name, slug, description, image, articleCount, isActive) VALUES (${id}, ${name}, ${slug}, ${description}, ${image}, 0, 1)`;
    res.json({ id, ...req.body, articleCount: 0, isActive: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  
  try {
    const { rows } = await db`SELECT * FROM categories WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: "Category not found" });
    const existing = rows[0];

    const updated = { ...existing, ...body };
    if (body.isActive !== undefined) updated.isActive = body.isActive ? 1 : 0;

    await db`
      UPDATE categories 
      SET name = ${updated.name}, slug = ${updated.slug}, description = ${updated.description}, image = ${updated.image}, isActive = ${updated.isActive}
      WHERE id = ${id}
    `;
    res.json({ id, ...updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`DELETE FROM categories WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Podcast Routes ---

app.get('/api/podcasts', async (req, res) => {
  try {
    const { rows } = await db`SELECT * FROM podcasts`;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/podcasts', async (req, res) => {
  const { title, description, coverImage, duration, publishedAt, audioUrl } = req.body;
  const id = `podcast_${Date.now()}`;
  
  try {
    await db`
      INSERT INTO podcasts (id, title, description, coverImage, duration, publishedAt, audioUrl)
      VALUES (${id}, ${title}, ${description}, ${coverImage}, ${duration}, ${publishedAt}, ${audioUrl})
    `;
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/podcasts/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  
  try {
    const { rows } = await db`SELECT * FROM podcasts WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: "Podcast not found" });
    const existing = rows[0];

    const updated = { ...existing, ...body };
    
    await db`
      UPDATE podcasts 
      SET title = ${updated.title}, description = ${updated.description}, coverImage = ${updated.coverImage}, duration = ${updated.duration}, publishedAt = ${updated.publishedAt}, audioUrl = ${updated.audioUrl}
      WHERE id = ${id}
    `;
    res.json({ id, ...updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/podcasts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`DELETE FROM podcasts WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Comments ---

app.get('/api/comments', async (req, res) => {
  const { articleId } = req.query;
  try {
    let query;
    if (articleId) {
      query = db`SELECT c.*, u.name as authorName, u.avatar as authorAvatar 
                 FROM comments c 
                 LEFT JOIN users u ON c.authorId = u.id 
                 WHERE c.articleId = ${articleId} 
                 ORDER BY c.createdAt DESC`;
    } else {
      query = db`SELECT * FROM comments ORDER BY createdAt DESC`;
    }
    const { rows } = await query;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  const { articleId, authorId, content } = req.body;
  const id = `comment_${Date.now()}`;
  const createdAt = new Date().toISOString();
  
  try {
    await db`
      INSERT INTO comments (id, articleId, authorId, content, createdAt, likes)
      VALUES (${id}, ${articleId}, ${authorId}, ${content}, ${createdAt}, 0)
    `;
    
    // Fetch the created comment with author details
    const { rows } = await db`
      SELECT c.*, u.name as authorName, u.avatar as authorAvatar 
      FROM comments c 
      LEFT JOIN users u ON c.authorId = u.id 
      WHERE c.id = ${id}
    `;
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`DELETE FROM comments WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Likes ---

app.get('/api/likes', async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.json([]);
    const { rows } = await db`SELECT articleId FROM article_likes WHERE userId = ${userId}`;
    res.json(rows.map(row => row.articleId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  console.log(`Like request: articleId=${id}, userId=${userId}`);

  try {
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    // Check if user exists
    const userCheck = await db`SELECT id FROM users WHERE id = ${userId}`;
    if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if article exists
    const articleCheck = await db`SELECT id FROM articles WHERE id = ${id}`;
    if (articleCheck.rows.length === 0) {
        return res.status(404).json({ error: "Article not found" });
    }

    // Check if already liked
    const { rows } = await db`SELECT id FROM article_likes WHERE articleId = ${id} AND userId = ${userId}`;
    if (rows.length > 0) return res.json({ message: "Already liked" });
    
    const likeId = `like_${Date.now()}`;
    const createdAt = new Date().toISOString();
    
    await db`
      INSERT INTO article_likes (id, articleId, userId, createdAt)
      VALUES (${likeId}, ${id}, ${userId}, ${createdAt})
    `;
    
    // Increment article likes count
    await db`UPDATE articles SET likes = likes + 1 WHERE id = ${id}`;
    
    res.json({ message: "Liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const { rows } = await db`DELETE FROM article_likes WHERE articleId = ${id} AND userId = ${userId} RETURNING id`;
    if (rows.length > 0) {
      await db`UPDATE articles SET likes = GREATEST(0, likes - 1) WHERE id = ${id}`;
    }
    res.json({ message: "Unliked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Site Settings ---

app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await db`SELECT * FROM site_settings WHERE id = 1`;
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

app.put('/api/settings', async (req, res) => {
  const body = req.body;
  
  try {
    // Check if settings exist
    const { rows } = await db`SELECT * FROM site_settings WHERE id = 1`;
    let existing = {};
    if (rows.length > 0) {
        existing = rows[0];
        // Parse socialLinks if it's a string in DB
        if (typeof existing.socialLinks === 'string') {
            try { existing.socialLinks = JSON.parse(existing.socialLinks); } catch (e) {}
        }
    }

    const updated = { ...existing, ...body };
    const socialLinksStr = JSON.stringify(updated.socialLinks || {});
    
    if (rows.length === 0) {
      await db`
        INSERT INTO site_settings (id, siteName, siteDescription, logo, primaryColor, socialLinks)
        VALUES (1, ${updated.siteName}, ${updated.siteDescription}, ${updated.logo}, ${updated.primaryColor}, ${socialLinksStr})
      `;
    } else {
      await db`
        UPDATE site_settings 
        SET siteName = ${updated.siteName}, siteDescription = ${updated.siteDescription}, logo = ${updated.logo}, primaryColor = ${updated.primaryColor}, socialLinks = ${socialLinksStr}
        WHERE id = 1
      `;
    }
    res.json({ ...updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

