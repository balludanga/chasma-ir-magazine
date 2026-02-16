import { Link, useParams } from 'react-router-dom';
import { Users, BookOpen, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import { ArticleCard } from '@/components/article/ArticleCard';
import { toast } from 'sonner';

export function Writers() {
  const { id } = useParams<{ id?: string }>();
  const { articles, subscribeToWriter, unsubscribeFromWriter, isSubscribedToWriter, getArticlesByWriter } = useBlog();
  const { isAuthenticated, user } = useAuth();

  // Get unique writers from articles
  const writers = articles
    .map(a => a.author)
    .filter((author, index, self) => 
      index === self.findIndex(a => a.id === author.id)
    );

  if (id) {
    const writer = writers.find(w => w.id === id);
    const writerArticles = getArticlesByWriter(id);
    const isSubscribed = isSubscribedToWriter(id);

    if (!writer) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Writer not found</p>
        </div>
      );
    }

    const handleSubscribe = () => {
      if (!isAuthenticated) {
        toast.error('Please sign in to subscribe');
        return;
      }
      if (isSubscribed) {
        unsubscribeFromWriter(id);
      } else {
        subscribeToWriter(id);
      }
    };

    return (
      <div className="min-h-screen pt-24 pb-12">
        {/* Writer Header */}
        <div className="bg-gray-50 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="w-32 h-32 border-4 border-[#e5a63f]">
                <AvatarImage src={writer.avatar} alt={writer.name} />
                <AvatarFallback className="bg-[#e5a63f] text-white text-4xl">
                  {writer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{writer.name}</h1>
                  <span className="px-3 py-1 bg-[#e5a63f]/10 text-[#e5a63f] rounded-full text-sm font-medium">
                    {writer.role}
                  </span>
                </div>
                
                <p className="text-gray-600 text-lg mb-6 max-w-2xl">
                  {writer.bio}
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span>{writerArticles.length} articles</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{writer.subscribers?.toLocaleString()} subscribers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {new Date(writer.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                
                {user?.id !== writer.id && (
                  <Button
                    onClick={handleSubscribe}
                    variant={isSubscribed ? 'outline' : 'default'}
                    className={isSubscribed ? 'border-[#e5a63f] text-[#e5a63f]' : 'bg-[#e5a63f] hover:bg-[#d4952f] text-white'}
                    size="lg"
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isSubscribed ? 'fill-current' : ''}`} />
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Writer's Articles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Articles by {writer.name}
          </h2>
          
          {writerArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {writerArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No articles yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Writers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented storytellers behind Lumina's curated content
          </p>
        </div>

        {/* Writers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {writers.map((writer) => {
            const writerArticles = getArticlesByWriter(writer.id);
            
            return (
              <Link
                key={writer.id}
                to={`/writer/${writer.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-gray-100 group-hover:border-[#e5a63f]/30 transition-colors">
                    <AvatarImage src={writer.avatar} alt={writer.name} />
                    <AvatarFallback className="bg-[#e5a63f] text-white text-2xl">
                      {writer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#e5a63f] transition-colors">
                    {writer.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{writer.role}</p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {writer.bio}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {writerArticles.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {writer.subscribers?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
