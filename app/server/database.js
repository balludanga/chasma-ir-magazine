import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initializeDatabase() {
  try {
    // In a Supabase setup, schema management (CREATE TABLE) is typically done
    // directly in the Supabase dashboard or via migrations.
    // The following CREATE TABLE statements have been removed.
    // Please ensure these tables exist in your Supabase project.

    await seedData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function seedData() {
  try {
    const { count } = await supabase.from('users').select('count', { count: 'exact' });
    if (count === 0) {
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

      const { error: usersError } = await supabase.from('users').insert(users);
      if (usersError) throw usersError;

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
      
      const { error: categoriesError } = await supabase.from('categories').insert(categories);
      if (categoriesError) throw categoriesError;

       // Seed Site Settings
       const siteSettings = {
          id: 1,
          siteName: 'Chasma IR Magazine',
          siteDescription: 'Expert analysis on International Relations',
          logo: '/logo.png',
          primaryColor: '#c78a55ff',
          socialLinks: {
            twitter: 'https://twitter.com/chasmaIR',
            facebook: 'https://facebook.com/chasmaIR'
          }
       };
       const { error: settingsError } = await supabase.from('site_settings').insert([siteSettings]);
       if (settingsError) throw settingsError;

      console.log("Data seeding completed.");
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

export { supabase, initializeDatabase };

