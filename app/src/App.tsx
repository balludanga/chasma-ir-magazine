import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { BlogProvider } from '@/context/BlogContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { Home } from '@/pages/Home';
import { ArticleDetail } from '@/pages/ArticleDetail';
import { UserDashboard } from '@/pages/UserDashboard';
import { WriterDashboard } from '@/pages/WriterDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Categories } from '@/pages/Categories';
import { Writers } from '@/pages/Writers';
import { Podcasts } from '@/pages/Podcasts';
import { Search } from '@/pages/Search';
import { About, Careers, Contact, Press, Help, Privacy, Terms, Cookies, Sitemap, Signup } from '@/pages/MiscPages';
import { Tag } from '@/pages/Tag';
import { PodcastDetail } from '@/pages/PodcastDetail';
import './App.css';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultAuthRole, setDefaultAuthRole] = useState<'reader' | 'writer' | 'admin'>('reader');

  const openLogin = (role: 'reader' | 'writer' | 'admin' = 'reader') => {
    setDefaultAuthRole(role);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => openLogin('reader')} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultRole={defaultAuthRole}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/writer-dashboard" element={<WriterDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<Categories />} />
          <Route path="/writers" element={<Writers />} />
          <Route path="/writer/:id" element={<Writers />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcast/:id" element={<PodcastDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tag/:tag" element={<Tag />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <AppContent />
          <Toaster position="top-center" richColors />
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
