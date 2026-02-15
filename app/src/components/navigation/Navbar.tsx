import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, BookOpen, LogOut, Shield, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';

interface NavbarProps {
  onLoginClick: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { likedArticles, subscriptions } = useBlog();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Writers', path: '/writers' },
    { name: 'Podcasts', path: '/podcasts' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div className={`flex flex-col ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                <span className="font-bold text-lg leading-tight">Chasma</span>
                <span className="text-xs tracking-wider uppercase opacity-80">IR Magazine</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-all hover:text-[#1e3a5f] ${
                    isActive(link.path)
                      ? 'text-[#1e3a5f]'
                      : isScrolled
                      ? 'text-gray-700'
                      : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex ${
                  isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                }`}
                onClick={() => navigate('/search')}
              >
                <Search className="w-5 h-5" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9 border-2 border-[#1e3a5f]">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-[#1e3a5f] text-white">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-[#1e3a5f] text-white">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {user?.role === 'admin' ? (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    ) : user?.role === 'writer' ? (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/writer-dashboard')}>
                          <PenTool className="mr-2 h-4 w-4" />
                          Writer Dashboard
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <User className="mr-2 h-4 w-4" />
                          My Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard?tab=liked')}>
                          <Heart className="mr-2 h-4 w-4" />
                          Liked Articles
                          {likedArticles.length > 0 && (
                            <span className="ml-auto text-xs bg-[#1e3a5f] text-white px-2 py-0.5 rounded-full">
                              {likedArticles.length}
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard?tab=subscriptions')}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Subscriptions
                          {subscriptions.length > 0 && (
                            <span className="ml-auto text-xs bg-[#1e3a5f] text-white px-2 py-0.5 rounded-full">
                              {subscriptions.length}
                            </span>
                          )}
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={onLoginClick}
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium py-3 border-b border-gray-100 ${
                  isActive(link.path) ? 'text-[#1e3a5f]' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium py-3 border-b border-gray-100 text-gray-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === 'writer' && (
                  <Link
                    to="/writer-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium py-3 border-b border-gray-100 text-gray-700"
                  >
                    Writer Dashboard
                  </Link>
                )}
                {user?.role === 'reader' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium py-3 border-b border-gray-100 text-gray-700"
                  >
                    My Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
