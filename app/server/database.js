import { sql } from '@vercel/postgres';
import { get } from '@vercel/edge-config';
import dotenv from 'dotenv';

dotenv.config();

const edgeConfigDbUrl = await get('POSTGRES_URL');
const connectionString = edgeConfigDbUrl || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not set in environment variables or Edge Config');
}

const db = sql(connectionString);

async function initializeDatabase() {
  try {
    // Users
    await db`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      avatar TEXT,
      role TEXT,
      bio TEXT,
      joinedAt TEXT,
      subscribers INTEGER,
      isActive INTEGER
    )`;

    // Articles
    await db`CREATE TABLE IF NOT EXISTS articles (
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
    )`;

    // Categories
    await db`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      slug TEXT,
      description TEXT,
      image TEXT,
      articleCount INTEGER,
      isActive INTEGER
    )`;

    // Podcasts
    await db`CREATE TABLE IF NOT EXISTS podcasts (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      coverImage TEXT,
      duration TEXT,
      publishedAt TEXT,
      audioUrl TEXT
    )`;

    // Comments
    await db`CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      articleId TEXT,
      authorId TEXT,
      content TEXT,
      createdAt TEXT,
      likes INTEGER,
      FOREIGN KEY(articleId) REFERENCES articles(id),
      FOREIGN KEY(authorId) REFERENCES users(id)
    )`;

    // Site Settings
    await db`CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      siteName TEXT,
      siteDescription TEXT,
      logo TEXT,
      primaryColor TEXT,
      socialLinks TEXT
    )`;

    // Subscriptions
    await db`CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      writerId TEXT,
      subscriberId TEXT,
      subscribedAt TEXT
    )`;

    // Liked Articles
    await db`CREATE TABLE IF NOT EXISTS liked_articles (
      id TEXT PRIMARY KEY,
      articleId TEXT,
      userId TEXT,
      createdAt TEXT
    )`;
    
    await seedData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function seedData() {
  try {
    const { rows } = await db`SELECT count(*) as count FROM users`;
    if (rows[0].count === '0') {
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

      for (const user of users) {
        await db`INSERT INTO users (id, name, email, avatar, role, bio, joinedAt, subscribers, isActive) VALUES (${user.id}, ${user.name}, ${user.email}, ${user.avatar}, ${user.role}, ${user.bio || ''}, ${user.joinedAt}, ${user.subscribers || 0}, ${user.isActive})`;
      }

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
      
      for (const cat of categories) {
        await db`INSERT INTO categories (id, name, slug, description, image, articleCount, isActive) VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.description}, ${cat.image}, ${cat.articleCount}, ${cat.isActive})`;
      }

       // Seed Site Settings
       await db`INSERT INTO site_settings (id, siteName, siteDescription, logo, primaryColor, socialLinks) VALUES (1, 'Chasma IR Magazine', 'Expert analysis on International Relations', '/logo.png', '#c78a55ff', ${JSON.stringify({
          twitter: 'https://twitter.com/chasmaIR',
          facebook: 'https://facebook.com/chasmaIR'
        })})`;

      console.log("Data seeding completed.");
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

export { db, initializeDatabase };

