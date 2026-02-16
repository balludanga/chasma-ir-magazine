import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Bookmark, Clock, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import { CommentSection } from '@/components/article/CommentSection';
import { ArticleCard } from '@/components/article/ArticleCard';
import { toast } from 'sonner';
import { gsap } from 'gsap';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, isArticleLiked, likeArticle, unlikeArticle, shareArticle, subscribeToWriter, isSubscribedToWriter, articles } = useBlog();
  const { isAuthenticated } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const article = getArticleById(id || '');
  const isLiked = article ? isArticleLiked(article.id) : false;
  const isSubscribed = article ? isSubscribedToWriter(article.author.id) : false;

  // Get related articles
  const relatedArticles = articles
    .filter(a => a.category === article?.category && a.id !== article?.id)
    .slice(0, 3);

  useEffect(() => {
    if (!article) {
      navigate('/');
      return;
    }

    // Animate content
    gsap.from('.article-header', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.article-content', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out',
    });

    gsap.from('.article-sidebar', {
      x: 30,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: 'power2.out',
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }, [article, navigate]);

  if (!article) return null;

  const handleLike = () => {
    if (isLiked) {
      unlikeArticle(article.id);
    } else {
      likeArticle(article.id);
    }
  };

  const handleShare = () => {
    shareArticle(article);
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }
    if (isSubscribed) {
      toast.info('Already subscribed to this writer');
    } else {
      subscribeToWriter(article.author.id);
    }
  };

  const handleBookmark = () => {
    toast.success('Article bookmarked!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : 'text-gray-600'}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {article.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="text-gray-600"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="article-header relative">
        {/* Cover Image */}
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Header Content */}
        <div className="relative -mt-32 z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-[#e5a63f] hover:bg-[#d4952f]">
                {article.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-[#e5a63f]">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-[#e5a63f] text-white text-lg">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link 
                    to={`/writer/${article.author.id}`}
                    className="font-semibold text-gray-900 hover:text-[#e5a63f] transition-colors"
                  >
                    {article.author.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {article.author.subscribers?.toLocaleString()} subscribers
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSubscribe}
                variant={isSubscribed ? 'outline' : 'default'}
                className={isSubscribed ? 'border-[#e5a63f] text-[#e5a63f]' : 'bg-[#e5a63f] hover:bg-[#d4952f] text-white'}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article 
              ref={contentRef}
              className="article-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#e5a63f] hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className={isLiked ? 'border-red-500 text-red-500' : ''}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{article.comments.length} comments</span>
                </div>
              </div>
            </div>

            <Separator className="my-10" />

            {/* Comments Section */}
            <CommentSection article={article} />
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar space-y-8">
            {/* Author Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">About the Author</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-[#e5a63f] text-white">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{article.author.name}</p>
                  <p className="text-sm text-gray-500">{article.author.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {article.author.bio}
              </p>
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-[#e5a63f] hover:bg-[#d4952f] text-white"
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4">Related Stories</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <ArticleCard 
                      key={related.id} 
                      article={related} 
                      variant="compact" 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-black rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest stories delivered to your inbox.
              </p>
              <Button className="w-full bg-[#e5a63f] hover:bg-[#d4952f] text-white">
                Subscribe
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
