import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { BlogContextType, BlogState, Article, Comment, Category, SiteSettings, Podcast } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { mockArticles, mockCategories, mockPodcasts, mockUsers, mockComments, siteSettings as defaultSiteSettings } from '@/data/mockData';

const initialState: BlogState = {
  articles: mockArticles,
  categories: mockCategories,
  podcasts: mockPodcasts,
  likedArticles: [],
  subscriptions: [],
  comments: mockComments,
  siteSettings: defaultSiteSettings,
  users: mockUsers,
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<BlogState>(initialState);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('chasma_likes');
    const savedSubscriptions = localStorage.getItem('chasma_subscriptions');
    const savedSettings = localStorage.getItem('chasma_settings');
    const savedUsers = localStorage.getItem('chasma_registered_users');
    
    if (savedLikes) {
      try {
        const likes = JSON.parse(savedLikes);
        setState(prev => ({ ...prev, likedArticles: likes }));
      } catch {
        localStorage.removeItem('chasma_likes');
      }
    }
    
    if (savedSubscriptions) {
      try {
        const subscriptions = JSON.parse(savedSubscriptions);
        setState(prev => ({ ...prev, subscriptions }));
      } catch {
        localStorage.removeItem('chasma_subscriptions');
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setState(prev => ({ ...prev, siteSettings: { ...prev.siteSettings, ...settings } }));
      } catch {
        localStorage.removeItem('chasma_settings');
      }
    }
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        setState(prev => ({ ...prev, users }));
      } catch {
        localStorage.removeItem('chasma_registered_users');
      }
    }
  }, []);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chasma_likes', JSON.stringify(state.likedArticles));
  }, [state.likedArticles]);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chasma_subscriptions', JSON.stringify(state.subscriptions));
  }, [state.subscriptions]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chasma_settings', JSON.stringify(state.siteSettings));
  }, [state.siteSettings]);

  const likeArticle = useCallback((articleId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like articles');
      return;
    }

    setState(prev => {
      const likedArticles = [...prev.likedArticles, articleId];
      const articles = prev.articles.map(article =>
        article.id === articleId
          ? { ...article, likes: article.likes + 1 }
          : article
      );
      
      toast.success('Article liked!');
      return { ...prev, likedArticles, articles };
    });
  }, [isAuthenticated]);

  const unlikeArticle = useCallback((articleId: string) => {
    setState(prev => {
      const likedArticles = prev.likedArticles.filter(id => id !== articleId);
      const articles = prev.articles.map(article =>
        article.id === articleId
          ? { ...article, likes: Math.max(0, article.likes - 1) }
          : article
      );
      
      toast.success('Article unliked');
      return { ...prev, likedArticles, articles };
    });
  }, []);

  const addComment = useCallback((articleId: string, content: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to comment');
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      articleId,
      author: user,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setState(prev => {
      const articles = prev.articles.map(article =>
        article.id === articleId
          ? { ...article, comments: [...article.comments, newComment] }
          : article
      );
      
      return { ...prev, articles, comments: [...prev.comments, newComment] };
    });

    toast.success('Comment added!');
  }, [isAuthenticated, user]);

  const subscribeToWriter = useCallback((writerId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    if (user?.id === writerId) {
      toast.error('You cannot subscribe to yourself');
      return;
    }

    setState(prev => {
      if (prev.subscriptions.includes(writerId)) {
        toast.info('Already subscribed to this writer');
        return prev;
      }
      
      const subscriptions = [...prev.subscriptions, writerId];
      const articles = prev.articles.map(article =>
        article.author.id === writerId
          ? { ...article, author: { ...article.author, subscribers: (article.author.subscribers || 0) + 1 } }
          : article
      );
      
      toast.success('Subscribed to writer!');
      return { ...prev, subscriptions, articles };
    });
  }, [isAuthenticated, user]);

  const unsubscribeFromWriter = useCallback((writerId: string) => {
    setState(prev => {
      const subscriptions = prev.subscriptions.filter(id => id !== writerId);
      const articles = prev.articles.map(article =>
        article.author.id === writerId
          ? { ...article, author: { ...article.author, subscribers: Math.max(0, (article.author.subscribers || 0) - 1) } }
          : article
      );
      
      toast.success('Unsubscribed from writer');
      return { ...prev, subscriptions, articles };
    });
  }, []);

  const isArticleLiked = useCallback((articleId: string) => {
    return state.likedArticles.includes(articleId);
  }, [state.likedArticles]);

  const isSubscribedToWriter = useCallback((writerId: string) => {
    return state.subscriptions.includes(writerId);
  }, [state.subscriptions]);

  const getArticleById = useCallback((id: string) => {
    return state.articles.find(article => article.id === id);
  }, [state.articles]);

  const getArticlesByCategory = useCallback((category: string) => {
    return state.articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }, [state.articles]);

  const getArticlesByWriter = useCallback((writerId: string) => {
    return state.articles.filter(article => article.author.id === writerId);
  }, [state.articles]);

  const getLikedArticles = useCallback(() => {
    return state.articles.filter(article => state.likedArticles.includes(article.id));
  }, [state.articles, state.likedArticles]);

  const getSubscribedWritersArticles = useCallback(() => {
    return state.articles.filter(article => state.subscriptions.includes(article.author.id));
  }, [state.articles, state.subscriptions]);

  const shareArticle = useCallback((article: Article) => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, []);

  // Admin Functions
  const updateArticleStatus = useCallback((articleId: string, status: 'published' | 'draft' | 'pending') => {
    setState(prev => {
      const articles = prev.articles.map(article =>
        article.id === articleId ? { ...article, status } : article
      );
      toast.success(`Article status updated to ${status}`);
      return { ...prev, articles };
    });
  }, []);

  const deleteArticle = useCallback((articleId: string) => {
    setState(prev => {
      const articles = prev.articles.filter(article => article.id !== articleId);
      toast.success('Article deleted successfully');
      return { ...prev, articles };
    });
  }, []);

  const updateUserStatus = useCallback((userId: string, isActive: boolean) => {
    setState(prev => {
      const users = prev.users.map(u =>
        u.id === userId ? { ...u, isActive } : u
      );
      const articles = prev.articles.map(article =>
        article.author.id === userId 
          ? { ...article, author: { ...article.author, isActive } }
          : article
      );
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      return { ...prev, users, articles };
    });
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id' | 'articleCount'>) => {
    setState(prev => {
      const newCategory: Category = {
        ...category,
        id: `cat_${Date.now()}`,
        articleCount: 0,
      };
      toast.success('Category added successfully');
      return { ...prev, categories: [...prev.categories, newCategory] };
    });
  }, []);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setState(prev => {
      const categories = prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      );
      toast.success('Category updated successfully');
      return { ...prev, categories };
    });
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setState(prev => {
      const categories = prev.categories.filter(cat => cat.id !== categoryId);
      toast.success('Category deleted successfully');
      return { ...prev, categories };
    });
  }, []);

  const updateSiteSettings = useCallback((settings: Partial<SiteSettings>) => {
    setState(prev => {
      toast.success('Site settings updated successfully');
      return { ...prev, siteSettings: { ...prev.siteSettings, ...settings } };
    });
  }, []);

  // Article CRUD Functions
  const createArticle = useCallback((articleData: Partial<Article>) => {
    if (!user) {
      toast.error('Please sign in to create articles');
      return;
    }

    setState(prev => {
      const newArticle: Article = {
        id: `article_${Date.now()}`,
        title: articleData.title || 'Untitled',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop',
        category: articleData.category || 'Uncategorized',
        author: user,
        publishedAt: articleData.publishedAt || new Date().toISOString().split('T')[0],
        readTime: articleData.readTime || 5,
        likes: 0,
        comments: [],
        tags: articleData.tags || [],
        status: articleData.status || 'draft',
        views: 0,
      };
      
      // Update category article count
      const categories = prev.categories.map(cat =>
        cat.name === newArticle.category
          ? { ...cat, articleCount: cat.articleCount + 1 }
          : cat
      );
      
      toast.success('Article created successfully!');
      return { ...prev, articles: [newArticle, ...prev.articles], categories };
    });
  }, [user]);

  const updateArticle = useCallback((articleId: string, articleData: Partial<Article>) => {
    setState(prev => {
      const oldArticle = prev.articles.find(a => a.id === articleId);
      const articles = prev.articles.map(article =>
        article.id === articleId ? { ...article, ...articleData } : article
      );
      
      // Update category counts if category changed
      let categories = prev.categories;
      if (articleData.category && oldArticle && oldArticle.category !== articleData.category) {
        categories = categories.map(cat => {
          if (cat.name === oldArticle.category) {
            return { ...cat, articleCount: Math.max(0, cat.articleCount - 1) };
          }
          if (cat.name === articleData.category) {
            return { ...cat, articleCount: cat.articleCount + 1 };
          }
          return cat;
        });
      }
      
      toast.success('Article updated successfully!');
      return { ...prev, articles, categories };
    });
  }, []);

  // Podcast CRUD Functions
  const createPodcast = useCallback((podcastData: Partial<Podcast>) => {
    setState(prev => {
      const newPodcast: Podcast = {
        id: `podcast_${Date.now()}`,
        title: podcastData.title || 'Untitled Episode',
        description: podcastData.description || '',
        coverImage: podcastData.coverImage || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop',
        duration: podcastData.duration || '30:00',
        publishedAt: podcastData.publishedAt || new Date().toISOString().split('T')[0],
        audioUrl: podcastData.audioUrl,
      };
      
      toast.success('Podcast episode created successfully!');
      return { ...prev, podcasts: [newPodcast, ...prev.podcasts] };
    });
  }, []);

  const updatePodcast = useCallback((podcastId: string, podcastData: Partial<Podcast>) => {
    setState(prev => {
      const podcasts = prev.podcasts.map(podcast =>
        podcast.id === podcastId ? { ...podcast, ...podcastData } : podcast
      );
      
      toast.success('Podcast episode updated successfully!');
      return { ...prev, podcasts };
    });
  }, []);

  const deletePodcast = useCallback((podcastId: string) => {
    setState(prev => {
      const podcasts = prev.podcasts.filter(podcast => podcast.id !== podcastId);
      toast.success('Podcast episode deleted successfully');
      return { ...prev, podcasts };
    });
  }, []);

  const value: BlogContextType = {
    ...state,
    likeArticle,
    unlikeArticle,
    addComment,
    subscribeToWriter,
    unsubscribeFromWriter,
    isArticleLiked,
    isSubscribedToWriter,
    getArticleById,
    getArticlesByCategory,
    getArticlesByWriter,
    getLikedArticles,
    getSubscribedWritersArticles,
    shareArticle,
    updateArticleStatus,
    deleteArticle,
    updateUserStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSiteSettings,
    createArticle,
    updateArticle,
    createPodcast,
    updatePodcast,
    deletePodcast,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
