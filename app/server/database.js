import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      avatar TEXT,
      role TEXT,
      bio TEXT,
      joinedAt TEXT,
      subscribers INTEGER,
      isActive INTEGER
    )`);

    // Articles
    db.run(`CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT,
      excerpt TEXT,
      content TEXT,
      coverImage TEXT,
      category TEXT,
      authorId TEXT,
      publishedAt TEXT,
      readTime INTEGER,
      likes INTEGER,
      tags TEXT,
      status TEXT,
      views INTEGER,
      FOREIGN KEY(authorId) REFERENCES users(id)
    )`);

    // Categories
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      slug TEXT,
      description TEXT,
      image TEXT,
      articleCount INTEGER,
      isActive INTEGER
    )`);

    // Podcasts
    db.run(`CREATE TABLE IF NOT EXISTS podcasts (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      coverImage TEXT,
      duration TEXT,
      publishedAt TEXT,
      audioUrl TEXT
    )`);

    // Comments
    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      articleId TEXT,
      authorId TEXT,
      content TEXT,
      createdAt TEXT,
      likes INTEGER,
      FOREIGN KEY(articleId) REFERENCES articles(id),
      FOREIGN KEY(authorId) REFERENCES users(id)
    )`);

    // Site Settings
    db.run(`CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      siteName TEXT,
      siteDescription TEXT,
      logo TEXT,
      primaryColor TEXT,
      socialLinks TEXT
    )`);

    // Subscriptions
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      writerId TEXT,
      subscriberId TEXT,
      subscribedAt TEXT
    )`);

    // Liked Articles
    db.run(`CREATE TABLE IF NOT EXISTS liked_articles (
      id TEXT PRIMARY KEY,
      articleId TEXT,
      userId TEXT,
      createdAt TEXT
    )`);
    
    seedData();
  });
}

function seedData() {
  db.get("SELECT count(*) as count FROM users", (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      console.log("Seeding data...");
      
      // Seed Users
      const users = [
        {
          id: '1',
          name: 'Dr. Priya Sharma',
          email: 'priya@chasma.ir',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          role: 'writer',
          bio: 'Senior Research Fellow at Centre for Strategic Studies. Specializes in India-China relations and Indo-Pacific security.',
          joinedAt: '2023-01-15',
          subscribers: 12500,
          isActive: 1,
        },
        {
          id: '2',
          name: 'Rahul Verma',
          email: 'rahul@chasma.ir',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          role: 'writer',
          bio: 'Foreign policy analyst with expertise in Middle East affairs and India-Gulf relations. Former diplomat.',
          joinedAt: '2023-02-20',
          subscribers: 8900,
          isActive: 1,
        },
        {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@chasma.ir',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          role: 'admin',
          joinedAt: '2023-01-01',
          isActive: 1,
        }
      ];

      const userStmt = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      users.forEach(user => {
        userStmt.run(user.id, user.name, user.email, user.avatar, user.role, user.bio || '', user.joinedAt, user.subscribers || 0, user.isActive);
      });
      userStmt.finalize();

      // Seed Categories
      const categories = [
        {
            id: '1',
            name: 'South Asia',
            slug: 'south-asia',
            description: 'Regional dynamics, bilateral relations, and security issues in South Asia.',
            image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=1000&fit=crop',
            articleCount: 24,
            isActive: 1,
        },
        {
            id: '2',
            name: 'Indo-Pacific',
            slug: 'indo-pacific',
            description: 'Strategic developments and great power competition in the Indo-Pacific region.',
            image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=1000&fit=crop',
            articleCount: 36,
            isActive: 1,
        }
      ];
      
      const catStmt = db.prepare("INSERT INTO categories VALUES (?, ?, ?, ?, ?, ?, ?)");
      categories.forEach(cat => {
        catStmt.run(cat.id, cat.name, cat.slug, cat.description, cat.image, cat.articleCount, cat.isActive);
      });
      catStmt.finalize();

       // Seed Site Settings
       db.run(`INSERT INTO site_settings (id, siteName, siteDescription, logo, primaryColor, socialLinks) VALUES (1, ?, ?, ?, ?, ?)`, 
        ['Chasma IR Magazine', 'Expert analysis on International Relations', '/logo.png', '#c78a55ff', JSON.stringify({
          twitter: 'https://twitter.com/chasmaIR',
          facebook: 'https://facebook.com/chasmaIR'
        })]
      );

      console.log("Data seeding completed.");
    }
  });
}

export default db;
