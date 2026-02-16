import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderTree, 
  Settings, 
  Mic,
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit2, 
  Plus,
  Eye,
  Search,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { PodcastEditor } from '@/components/editor/PodcastEditor';
import { toast } from 'sonner';
import type { Article, Podcast } from '@/types';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    articles, 
    categories, 
    users, 
    podcasts,
    siteSettings,
    updateArticleStatus, 
    deleteArticle,
    updateUserStatus,
    addCategory,
    deleteCategory,
    updateSiteSettings,
    createPodcast,
    updatePodcast,
    deletePodcast
  } = useBlog();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [podcastSearchQuery, setPodcastSearchQuery] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  
  // Editor states
  const [isPodcastEditorOpen, setIsPodcastEditorOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This dashboard is reserved for administrators only.
          </p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Stats
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const pendingArticles = articles.filter(a => a.status === 'pending').length;
  const totalUsers = users.length;
  const activeWriters = users.filter(u => u.role === 'writer' && u.isActive).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.comments.length, 0);

  // Filtered data
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPodcasts = podcasts.filter(p => 
    p.title.toLowerCase().includes(podcastSearchQuery.toLowerCase())
  );

  const handleSaveSettings = () => {
    updateSiteSettings(settingsForm);
  };

  const handleAddCategory = () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('Name and slug are required');
      return;
    }
    addCategory({
      name: categoryForm.name,
      slug: categoryForm.slug,
      description: categoryForm.description,
      image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=1000&fit=crop',
      isActive: true,
    });
    setCategoryForm({ name: '', slug: '', description: '' });
  };

  // Article Editor handlers
  const handleNewArticle = () => {
    navigate('/editor');
  };

  const handleEditArticle = (article: Article) => {
    navigate(`/editor/${article.id}`);
  };

  // Podcast Editor handlers
  const handleNewPodcast = () => {
    setEditingPodcast(null);
    setEditorMode('create');
    setIsPodcastEditorOpen(true);
  };

  const handleEditPodcast = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setEditorMode('edit');
    setIsPodcastEditorOpen(true);
  };

  const handleSavePodcast = (podcastData: Partial<Podcast>) => {
    if (editorMode === 'create') {
      createPodcast(podcastData);
    } else if (editingPodcast) {
      updatePodcast(editingPodcast.id, podcastData);
    }
    setIsPodcastEditorOpen(false);
    setEditingPodcast(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your magazine content and settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              <UserCheck className="w-4 h-4 mr-1" />
              Admin: {user.name}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Articles</CardTitle>
              <FileText className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-gray-500 mt-1">
                {publishedArticles} published, {pendingArticles} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
              <Eye className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Writers</CardTitle>
              <Users className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWriters}</div>
              <p className="text-xs text-gray-500 mt-1">
                of {totalUsers} total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Engagement</CardTitle>
              <MessageSquare className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes + totalComments}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalLikes} likes, {totalComments} comments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="rounded-lg">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="articles" className="rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="rounded-lg">
              <Mic className="w-4 h-4 mr-2" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg">
              <FolderTree className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center gap-4">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{article.title}</p>
                          <p className="text-sm text-gray-500">{article.author.name}</p>
                        </div>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...articles]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((article, index) => (
                        <div key={article.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{article.title}</p>
                            <p className="text-sm text-gray-500">{(article.views || 0).toLocaleString()} views</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>All Articles</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleNewArticle} className="bg-[#1e3a5f]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Article</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Author</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Views</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Likes</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <Link 
                                  to={`/article/${article.id}`}
                                  className="font-medium text-gray-900 hover:text-[#1e3a5f] transition-colors line-clamp-1"
                                >
                                  {article.title}
                                </Link>
                                <p className="text-xs text-gray-500">{article.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{article.author.name}</td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant={article.status === 'published' ? 'default' : article.status === 'pending' ? 'secondary' : 'outline'}
                              className={article.status === 'published' ? 'bg-green-600' : ''}
                            >
                              {article.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{(article.views || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{article.likes}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {article.status !== 'published' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateArticleStatus(article.id, 'published')}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditArticle(article)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteArticle(article.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="podcasts">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Podcast Episodes</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleNewPodcast} className="bg-[#1e3a5f]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Episode
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search podcasts..."
                      value={podcastSearchQuery}
                      onChange={(e) => setPodcastSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPodcasts.map((podcast) => (
                    <div key={podcast.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={podcast.coverImage}
                          alt={podcast.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{podcast.title}</h4>
                          <p className="text-sm text-gray-500">{podcast.duration}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(podcast.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{podcast.description}</p>
                      <div className="flex items-center justify-end gap-1 mt-3">
                        {podcast.audioUrl && (
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPodcast(podcast)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePodcast(podcast.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">User</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={u.avatar} alt={u.name} />
                                <AvatarFallback className="bg-[#1e3a5f] text-white">
                                  {u.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="capitalize">
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(u.joinedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge 
                              variant={u.isActive ? 'default' : 'secondary'}
                              className={u.isActive ? 'bg-green-600' : 'bg-gray-400'}
                            >
                              {u.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateUserStatus(u.id, !u.isActive)}
                              className={u.isActive ? 'text-red-600' : 'text-green-600'}
                            >
                              {u.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#1e3a5f]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="Category name"
                        />
                      </div>
                      <div>
                        <Label>Slug</Label>
                        <Input
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="category-slug"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Brief description"
                        />
                      </div>
                      <Button onClick={handleAddCategory} className="w-full bg-[#1e3a5f]">
                        Add Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-gray-500">/{category.slug}</p>
                          <p className="text-sm text-gray-600 mt-1">{category.articleCount} articles</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <Label>Site Name</Label>
                    <Input
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Site Description</Label>
                    <Input
                      value={settingsForm.siteDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                      />
                      <div 
                        className="w-10 h-10 rounded-lg border"
                        style={{ backgroundColor: settingsForm.primaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Twitter URL</Label>
                    <Input
                      value={settingsForm.socialLinks.twitter || ''}
                      onChange={(e) => setSettingsForm({ 
                        ...settingsForm, 
                        socialLinks: { ...settingsForm.socialLinks, twitter: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Facebook URL</Label>
                    <Input
                      value={settingsForm.socialLinks.facebook || ''}
                      onChange={(e) => setSettingsForm({ 
                        ...settingsForm, 
                        socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={settingsForm.socialLinks.linkedin || ''}
                      onChange={(e) => setSettingsForm({ 
                        ...settingsForm, 
                        socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value }
                      })}
                    />
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-[#1e3a5f]">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Podcast Editor */}
      <PodcastEditor
        podcast={editingPodcast}
        isOpen={isPodcastEditorOpen}
        onClose={() => {
          setIsPodcastEditorOpen(false);
          setEditingPodcast(null);
        }}
        onSave={handleSavePodcast}
        mode={editorMode}
      />
    </div>
  );
}
