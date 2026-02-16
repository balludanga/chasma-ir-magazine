import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, BookOpen, User, Settings, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { ArticleCard } from '@/components/article/ArticleCard';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { toast } from 'sonner';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { getLikedArticles, getSubscribedWritersArticles, subscriptions, articles } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  const likedArticles = getLikedArticles();
  const subscribedArticles = getSubscribedWritersArticles();

  // Get subscribed writers info
  const subscribedWriters = articles
    .filter(a => subscriptions.includes(a.author.id))
    .map(a => a.author)
    .filter((author, index, self) => 
      index === self.findIndex(a => a.id === author.id)
    );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-[#e5a63f]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-[#e5a63f] text-white text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-[#e5a63f]">{likedArticles.length}</p>
                  <p className="text-xs text-gray-500">Liked Articles</p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-[#e5a63f]">{subscriptions.length}</p>
                  <p className="text-xs text-gray-500">Subscriptions</p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg">
                  <p className="text-2xl font-bold text-[#e5a63f]">
                    {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">Member Since</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <EditProfileDialog>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </EditProfileDialog>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-white p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="rounded-lg">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="liked" className="rounded-lg">
              <Heart className="w-4 h-4 mr-2" />
              Liked Articles
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-lg">
              <BookOpen className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Liked Articles Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Recently Liked</h3>
                  <Button 
                    variant="link" 
                    className="text-[#e5a63f]"
                    onClick={() => handleTabChange('liked')}
                  >
                    View All
                  </Button>
                </div>
                {likedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {likedArticles.slice(0, 3).map((article) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No liked articles yet</p>
                    <p className="text-sm">Start exploring and like articles you enjoy!</p>
                  </div>
                )}
              </div>

              {/* Subscriptions Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Your Subscriptions</h3>
                  <Button 
                    variant="link" 
                    className="text-[#e5a63f]"
                    onClick={() => handleTabChange('subscriptions')}
                  >
                    View All
                  </Button>
                </div>
                {subscribedWriters.length > 0 ? (
                  <div className="space-y-4">
                    {subscribedWriters.slice(0, 3).map((writer) => (
                      <div key={writer.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={writer.avatar} alt={writer.name} />
                          <AvatarFallback className="bg-[#e5a63f] text-white">
                            {writer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{writer.name}</p>
                          <p className="text-sm text-gray-500">
                            {writer.subscribers?.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No subscriptions yet</p>
                    <p className="text-sm">Subscribe to writers you enjoy!</p>
                  </div>
                )}
              </div>
            </div>

            {/* From Your Subscriptions */}
            {subscribedArticles.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Latest from Your Subscriptions</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscribedArticles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Liked Articles</h3>
              {likedArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No liked articles yet</p>
                  <p className="text-sm mt-2">Articles you like will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="space-y-6">
              {/* Subscribed Writers */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-6">Writers You Follow</h3>
                {subscribedWriters.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subscribedWriters.map((writer) => (
                      <div key={writer.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={writer.avatar} alt={writer.name} />
                          <AvatarFallback className="bg-[#e5a63f] text-white">
                            {writer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{writer.name}</p>
                          <p className="text-sm text-gray-500">
                            {writer.subscribers?.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No subscriptions yet</p>
                    <p className="text-sm mt-2">Subscribe to writers to see their latest articles</p>
                  </div>
                )}
              </div>

              {/* Articles from Subscriptions */}
              {subscribedArticles.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-6">Latest from Subscribed Writers</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscribedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Notifications</h3>
              <div className="text-center py-16 text-gray-500">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm mt-2">We'll notify you about new articles from writers you follow</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
