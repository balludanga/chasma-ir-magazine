# Chasma IR Magazine - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Chasma IR Magazine website to various hosting platforms.

## Project Structure
```
app/
├── dist/              # Production build output
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   ├── data/          # Mock data and types
│   └── ...
├── public/            # Static assets
└── package.json       # Dependencies
```

## Quick Deploy Options

### Option 1: Deploy to Netlify (Recommended)

1. **Build the project:**
   ```bash
   cd app
   npm install
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or drag & drop:**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area
   - Your site will be live instantly!

### Option 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd app
   vercel --prod
   ```

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install -g gh-pages
   ```

2. **Update vite.config.ts:**
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

3. **Deploy:**
   ```bash
   npm run build
   gh-pages -d dist
   ```

### Option 4: Deploy to Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Set public directory to `dist`**

4. **Deploy:**
   ```bash
   firebase deploy
   ```

### Option 5: Traditional Web Hosting (cPanel/FTP)

1. **Build the project:**
   ```bash
   cd app
   npm install
   npm run build
   ```

2. **Upload files:**
   - Upload all contents of the `dist` folder to your web server
   - Ensure `index.html` is at the root
   - Configure server to handle client-side routing (see below)

## Server Configuration

### Apache (.htaccess)
Create a `.htaccess` file in the root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx
Add to your server block:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Environment Variables

Create a `.env` file in the `app` directory:
```
VITE_API_URL=https://your-api-url.com
VITE_SITE_NAME=Chasma IR Magazine
```

## Features Included

### For Readers
- Browse articles by category
- Like and comment on articles
- Subscribe to writers
- Search functionality
- Podcast listening

### For Writers
- Rich text article editor with Quill
- Image and video embedding
- Article management dashboard
- Analytics and performance tracking
- Comment management

### For Admins
- Full site management dashboard
- Article approval workflow
- User management (activate/deactivate)
- Category management
- Podcast episode management
- Site settings customization
- Analytics overview

## Demo Credentials

| Role  | Email                | Password |
|-------|---------------------|----------|
| Admin | admin@chasma.ir     | password |
| Writer| priya@chasma.ir     | password |
| Reader| reader@chasma.ir    | password |

## Post-Deployment Checklist

- [ ] Test all user roles (admin, writer, reader)
- [ ] Verify article creation and editing
- [ ] Test podcast functionality
- [ ] Check responsive design on mobile
- [ ] Verify social sharing
- [ ] Test search functionality
- [ ] Check all navigation links

## Troubleshooting

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Routing Issues
- Ensure server is configured for SPA (Single Page Application)
- Check `base` path in vite.config.ts

### Data Persistence
- Currently uses localStorage for demo
- For production, connect to a backend API

## Customization

### Change Primary Color
Edit `src/data/mockData.ts`:
```typescript
export const siteSettings: SiteSettings = {
  primaryColor: '#your-color-here',
  // ...
}
```

### Add New Categories
Use the Admin Dashboard → Categories tab, or edit `src/data/mockData.ts`

### Update Site Information
Use the Admin Dashboard → Settings tab

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure Node.js version is 18+

---

**Happy Publishing! 🚀**
