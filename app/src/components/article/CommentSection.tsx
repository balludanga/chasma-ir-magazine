import { useState } from 'react';
import { Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import type { Article, Comment } from '@/types';

interface CommentSectionProps {
  article: Article;
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
        <AvatarFallback className="bg-[#e5a63f] text-white">
          {comment.author?.name?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">{comment.author?.name || 'Unknown'}</span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
        
        <div className="flex items-center gap-4 mt-3">
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#e5a63f] transition-colors">
            <Heart className="w-4 h-4" />
            <span>{comment.likes}</span>
          </button>
          <button className="text-xs text-gray-500 hover:text-[#e5a63f] transition-colors">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ article }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { addComment } = useBlog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(article.id, commentText);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({article.comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-[#e5a63f] text-white">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-none focus:ring-[#e5a63f] focus:border-[#e5a63f]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-[#e5a63f] hover:bg-[#d4952f] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 text-center bg-gray-50 rounded-xl">
          <p className="text-gray-600 mb-3">Sign in to join the conversation</p>
          <p className="text-sm text-gray-500">
            Share your thoughts and connect with other readers
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {article.comments.length > 0 ? (
          article.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
