import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Eye, Heart, MessageCircle, TrendingUp, Users, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { ArticleCard } from '@/components/article/ArticleCard';

export function WriterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getArticlesByWriter } = useBlog();
  const [activeTab, setActiveTab] = useState('articles');

  // If user is not a writer, show message
  if (user?.role !== 'writer' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Writer Access Only</h2>
          <p className="text-gray-600 mb-6">
            This dashboard is reserved for writers. Upgrade your account to start publishing articles.
          </p>
          <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white">
            Become a Writer
          </Button>
        </div>
      </div>
    );
  }

  const myArticles = getArticlesByWriter(user?.id || '');
  
  // Calculate stats
  const totalViews = myArticles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = myArticles.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = myArticles.reduce((sum, a) => sum + a.comments.length, 0);
  const subscribers = user?.subscribers || 0;

  // Get recent articles
  const recentArticles = myArticles.slice(0, 5);

  // Get top performing articles
  const topArticles = [...myArticles]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Writer Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your articles and track performance</p>
          </div>
          <Button 
            onClick={() => navigate('/editor')}
            className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Articles</CardTitle>
              <FileText className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myArticles.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {myArticles.filter(a => a.publishedAt > '2024-01-01').length} this month
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
                +12% this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Likes</CardTitle>
              <Heart className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Subscribers</CardTitle>
              <Users className="w-4 h-4 text-[#1e3a5f]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribers.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +24 this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 rounded-xl mb-6">
            <TabsTrigger value="articles" className="rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              My Articles
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {myArticles.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Article</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Views</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">Likes</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <Link 
                                  to={`/article/${article.id}`}
                                  className="font-medium text-gray-900 hover:text-[#1e3a5f] transition-colors line-clamp-1"
                                >
                                  {article.title}
                                </Link>
                                <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-700'
                                : article.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {article.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600">
                            {(article.views || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600">
                            {article.likes}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/editor/${article.id}`)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-6">Start writing and share your stories with the world</p>
                <Button 
                  onClick={() => navigate('/editor')}
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Article
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performing Articles */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Top Performing Articles</h3>
                {topArticles.length > 0 ? (
                  <div className="space-y-4">
                    {topArticles.map((article, index) => (
                      <div key={article.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/article/${article.id}`}
                            className="font-medium text-gray-900 hover:text-[#1e3a5f] transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <p className="text-sm text-gray-500">{article.likes} likes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>

              {/* Engagement Overview */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Engagement Overview</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Likes per article</span>
                      <span className="font-semibold">
                        {myArticles.length > 0 ? Math.round(totalLikes / myArticles.length) : 0}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1e3a5f] rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Comments per article</span>
                      <span className="font-semibold">
                        {myArticles.length > 0 ? Math.round(totalComments / myArticles.length) : 0}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1e3a5f] rounded-full"
                        style={{ width: '45%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Subscriber growth</span>
                      <span className="font-semibold text-green-600">+24 this week</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent Articles Performance</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent Comments</h3>
              {myArticles.some(a => a.comments.length > 0) ? (
                <div className="space-y-4">
                  {myArticles
                    .flatMap(a => a.comments.map(c => ({ ...c, articleTitle: a.title, articleId: a.id })))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((comment) => (
                      <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                          <AvatarFallback className="bg-[#1e3a5f] text-white">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comment.author.name}</span>
                            <span className="text-xs text-gray-500">
                              on{' '}
                              <Link 
                                to={`/article/${comment.articleId}`}
                                className="text-[#1e3a5f] hover:underline"
                              >
                                {comment.articleTitle}
                              </Link>
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No comments yet</p>
                  <p className="text-sm">Comments on your articles will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
