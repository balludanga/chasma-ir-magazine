import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Article } from '@/types';
import { useBlog } from '@/context/BlogContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  showActions?: boolean;
}

export function ArticleCard({ article, variant = 'default', showActions = true }: ArticleCardProps) {
  const { isArticleLiked, likeArticle, unlikeArticle, shareArticle } = useBlog();
  const isLiked = isArticleLiked(article.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      unlikeArticle(article.id);
    } else {
      likeArticle(article.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    shareArticle(article);
  };

  if (variant === 'featured') {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group block relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#1e3a5f] rounded-full text-xs font-medium">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </span>
          </div>
          
          <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
            {article.title}
          </h3>
          
          <p className="text-white/80 text-sm line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-white/30">
                <AvatarImage src={article.author?.avatar} alt={article.author?.name} />
                <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                  {article.author?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{article.author?.name || 'Unknown'}</p>
                <p className="text-xs text-white/60">{article.publishedAt}</p>
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`text-white hover:text-white hover:bg-white/20 ${
                    isLiked ? 'text-red-400' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1">{article.likes}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-[#1e3a5f]">{article.category}</span>
          <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
            {article.title}
          </h4>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{article.author?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{article.readTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group flex flex-col sm:flex-row gap-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <div className="flex-1 p-4 sm:py-4 sm:pr-4 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={article.author?.avatar} alt={article.author?.name} />
                <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                  {article.author?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{article.author?.name || 'Unknown'}</span>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1 text-xs">{article.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 px-2 text-gray-500"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/article/${article.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {article.readTime} min
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={article.author?.avatar} alt={article.author?.name} />
              <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                {article.author?.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-gray-900">{article.author?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{article.publishedAt}</p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="ml-1 text-xs">{article.likes}</span>
              </Button>
              {article.comments.length > 0 && (
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>{article.comments.length}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
