import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { BlogContextType, BlogState, Article, Comment, Category, SiteSettings, Podcast } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const defaultSiteSettings: SiteSettings = {
  siteName: 'Chasma IR Magazine',
  siteDescription: 'International Relations Analysis',
  logo: '',
  primaryColor: '#000000',
  socialLinks: {}
};

const initialState: BlogState = {
  articles: [],
  categories: [],
  podcasts: [],
  likedArticles: [],
  subscriptions: [],
  comments: [],
  siteSettings: defaultSiteSettings,
  users: [],
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<BlogState>(initialState);

  // Load from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes, usersRes, settingsRes, podcastsRes, commentsRes] = await Promise.all([
          fetch(`${API_URL}/articles`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/users`),
          fetch(`${API_URL}/settings`),
          fetch(`${API_URL}/podcasts`),
          fetch(`${API_URL}/comments`)
        ]);

        if (articlesRes.ok && categoriesRes.ok && usersRes.ok) {
            const articles = await articlesRes.json();
            const categories = await categoriesRes.json();
            const users = await usersRes.json();
            const settings = await settingsRes.json();
            const podcasts = await podcastsRes.json();
            const comments = commentsRes.ok ? await commentsRes.json() : [];
            
            // Map comments to articles
            const articlesWithComments = Array.isArray(articles) ? articles.map((article: any) => {
                const articleComments = Array.isArray(comments) ? comments.filter((c: any) => c.articleId === article.id).map((c: any) => ({
                    ...c,
                    author: Array.isArray(users) ? (users.find((u: any) => u.id === c.authorId) || { id: c.authorId, name: 'Unknown' }) : { id: c.authorId, name: 'Unknown' }
                })) : [];
                return { ...article, comments: articleComments };
            }) : [];
            
            setState(prev => ({
                ...prev,
                articles: articlesWithComments,
                categories: Array.isArray(categories) ? categories : prev.categories,
                users: Array.isArray(users) ? users : prev.users,
                siteSettings: settings.id ? settings : prev.siteSettings,
                podcasts: Array.isArray(podcasts) ? podcasts : prev.podcasts,
                comments: Array.isArray(comments) ? comments : []
            }));
        }
      } catch (error) {
        console.error("Failed to load data from server:", error);
        toast.error("Could not connect to database server");
      }
    };
    fetchData();
  }, []);

  // Load liked articles when user changes
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/likes?userId=${user.id}`)
        .then(res => res.json())
        .then(likedIds => {
          if (Array.isArray(likedIds)) {
             setState(prev => ({ ...prev, likedArticles: likedIds }));
          }
        })
        .catch(err => console.error("Failed to load likes", err));
    } else {
      setState(prev => ({ ...prev, likedArticles: [] }));
    }
  }, [user]);

  // Persistence effects removed in favor of API


  const likeArticle = useCallback(async (articleId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to like articles');
      return;
    }

    try {
        const response = await fetch(`${API_URL}/articles/${articleId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
        });
        
        if (!response.ok) {
            const data = await response.json();
            if (data.message === "Already liked") {
                toast.info("You already liked this article");
                return;
            }
            throw new Error('Failed to like article');
        }

        setState(prev => {
          const likedArticles = [...prev.likedArticles, articleId];
          const articles = prev.articles.map(article =>
            article.id === articleId
              ? { ...article, likes: (article.likes || 0) + 1 }
              : article
          );
          
          toast.success('Article liked!');
          return { ...prev, likedArticles, articles };
        });
    } catch (error) {
        console.error('Like error:', error);
        toast.error('Failed to like article');
    }
  }, [isAuthenticated, user]);

  const unlikeArticle = useCallback(async (articleId: string) => {
    if (!isAuthenticated || !user) return;

    try {
        const response = await fetch(`${API_URL}/articles/${articleId}/like?userId=${user.id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to unlike article');

        setState(prev => {
          const likedArticles = prev.likedArticles.filter(id => id !== articleId);
          const articles = prev.articles.map(article =>
            article.id === articleId
              ? { ...article, likes: Math.max(0, (article.likes || 0) - 1) }
              : article
          );
          
          toast.success('Article unliked');
          return { ...prev, likedArticles, articles };
        });
    } catch (error) {
        console.error('Unlike error:', error);
        toast.error('Failed to unlike article');
    }
  }, [isAuthenticated, user]);

  const addComment = useCallback(async (articleId: string, content: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to comment');
      return;
    }

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleId, authorId: user.id, content })
        });
        
        if (!response.ok) throw new Error('Failed to add comment');
        const newCommentRaw = await response.json();
        
        // Construct full comment object with author
        const newComment: Comment = {
            ...newCommentRaw,
            author: user
        };

        setState(prev => {
          const articles = prev.articles.map(article =>
            article.id === articleId
              ? { ...article, comments: [newComment, ...(article.comments || [])] }
              : article
          );
          
          return { ...prev, articles, comments: [newComment, ...prev.comments] };
        });

        toast.success('Comment added!');
    } catch (error) {
        console.error('Add comment error:', error);
        toast.error('Failed to add comment');
    }
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
        article.author?.id === writerId
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
        article.author?.id === writerId
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
    return state.articles.filter(article => article.author?.id === writerId);
  }, [state.articles]);

  const getLikedArticles = useCallback(() => {
    return state.articles.filter(article => state.likedArticles.includes(article.id));
  }, [state.articles, state.likedArticles]);

  const getSubscribedWritersArticles = useCallback(() => {
    return state.articles.filter(article => state.subscriptions.includes(article.author?.id));
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
  const updateArticleStatus = useCallback(async (articleId: string, status: 'published' | 'draft' | 'pending') => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setState(prev => {
        const articles = prev.articles.map(article =>
          article.id === articleId ? { ...article, status } : article
        );
        toast.success(`Article status updated to ${status}`);
        return { ...prev, articles };
      });
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  }, []);

  const deleteArticle = useCallback(async (articleId: string) => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete article');

      setState(prev => {
        const articles = prev.articles.filter(article => article.id !== articleId);
        toast.success('Article deleted successfully');
        return { ...prev, articles };
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete article');
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) throw new Error('Failed to update user status');

      setState(prev => {
        const users = prev.users.map(u =>
          u.id === userId ? { ...u, isActive } : u
        );
        const articles = prev.articles.map(article =>
          article.author?.id === userId 
            ? { ...article, author: { ...article.author, isActive } }
            : article
        );
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        return { ...prev, users, articles };
      });
    } catch (error) {
      console.error('Update user status error:', error);
      toast.error('Failed to update user status');
    }
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'articleCount'>) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      
      if (!response.ok) throw new Error('Failed to add category');
      
      const newCategory = await response.json();
      
      setState(prev => {
        toast.success('Category added successfully');
        return { ...prev, categories: [...prev.categories, newCategory] };
      });
    } catch (error) {
      console.error('Add category error:', error);
      toast.error('Failed to add category');
    }
  }, []);

  const updateCategory = useCallback(async (categoryId: string, updates: Partial<Category>) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      await response.json(); // Usually returns updated object or we use local updates

      setState(prev => {
        const categories = prev.categories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        );
        toast.success('Category updated successfully');
        return { ...prev, categories };
      });
    } catch (error) {
       console.error('Update category error:', error);
       toast.error('Failed to update category');
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete category');

      setState(prev => {
        const categories = prev.categories.filter(cat => cat.id !== categoryId);
        toast.success('Category deleted successfully');
        return { ...prev, categories };
      });
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Failed to delete category');
    }
  }, []);

  const updateSiteSettings = useCallback(async (settings: Partial<SiteSettings>) => {
    try {
       // We need to merge with existing settings for the API call if it expects full object, 
       // but our API endpoint implementation handles partial updates via separate SQL not really... 
       // The API I wrote expects full object or at least the fields to update.
       // Actually, the API I wrote replaces all fields provided.
       // But wait, the API I wrote expects ALL fields: `const { siteName... } = req.body`.
       // So we should probably send the FULL merged settings.
       
       // Accessing current state inside callback is tricky if we don't have it.
       // But `setState` gives us `prev`.
       // We can't use `state` variable directly if it's not in dependency array (which would cause infinite loops if we added it).
       
       // Workaround: We will optimistically update state, then call API with the new state?
       // Or we rely on the component passing the FULL settings?
       // `AdminDashboard` passes `settingsForm` which is full settings state.
       
       const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) throw new Error('Failed to update settings');

      setState(prev => {
        toast.success('Site settings updated successfully');
        return { ...prev, siteSettings: { ...prev.siteSettings, ...settings } };
      });
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('Failed to update settings');
    }
  }, []);

  // Article CRUD Functions
  const createArticle = useCallback(async (articleData: Partial<Article>) => {
    if (!user) {
      toast.error('You must be logged in to create an article');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...articleData,
          authorId: user.id,
          publishedAt: articleData.status === 'published' ? new Date().toISOString() : articleData.publishedAt,
          readTime: Math.ceil((articleData.content?.length || 0) / 1000),
          status: articleData.status || 'pending'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      const newArticle = await response.json();
      
      // Ensure we have the full article structure including author object
      const formattedArticle = {
          ...newArticle,
          author: user,
          comments: [],
          likes: 0
      };

      setState(prev => {
        toast.success('Article created successfully!');
        // Update category count
        const categories = prev.categories.map(cat => 
          cat.id === formattedArticle.category || cat.name === formattedArticle.category
            ? { ...cat, articleCount: (cat.articleCount || 0) + 1 }
            : cat
        );
        return { ...prev, articles: [...prev.articles, formattedArticle], categories };
      });
    } catch (error) {
      console.error('Create article error:', error);
      toast.error('Failed to create article');
    }
  }, [user]);

  const updateArticle = useCallback(async (articleId: string, articleData: Partial<Article>) => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });

      if (!response.ok) throw new Error('Failed to update article');

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
    } catch (error) {
      console.error('Update article error:', error);
      toast.error('Failed to update article');
    }
  }, []);

  // Podcast CRUD Functions
  const createPodcast = useCallback(async (podcastData: Partial<Podcast>) => {
    const newPodcast: Podcast = {
      id: `podcast_${Date.now()}`,
      title: podcastData.title || 'Untitled Episode',
      description: podcastData.description || '',
      coverImage: podcastData.coverImage || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop',
      duration: podcastData.duration || '00:00',
      publishedAt: podcastData.publishedAt || new Date().toISOString(),
      audioUrl: podcastData.audioUrl || ''
    };

    try {
      const response = await fetch(`${API_URL}/podcasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPodcast)
      });

      if (!response.ok) throw new Error('Failed to create podcast');
      const savedPodcast = await response.json();

      setState(prev => {
        toast.success('Podcast episode created successfully!');
        return { ...prev, podcasts: [savedPodcast, ...prev.podcasts] };
      });
    } catch (error) {
      console.error('Create podcast error:', error);
      toast.error('Failed to create podcast');
    }
  }, []);

  const updatePodcast = useCallback(async (podcastId: string, podcastData: Partial<Podcast>) => {
    try {
      const response = await fetch(`${API_URL}/podcasts/${podcastId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podcastData)
      });

      if (!response.ok) throw new Error('Failed to update podcast');

      setState(prev => {
        const podcasts = prev.podcasts.map(podcast =>
          podcast.id === podcastId ? { ...podcast, ...podcastData } : podcast
        );
        
        toast.success('Podcast episode updated successfully!');
        return { ...prev, podcasts };
      });
    } catch (error) {
      console.error('Update podcast error:', error);
      toast.error('Failed to update podcast');
    }
  }, []);

  const deletePodcast = useCallback(async (podcastId: string) => {
    try {
      const response = await fetch(`${API_URL}/podcasts/${podcastId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete podcast');

      setState(prev => {
        const podcasts = prev.podcasts.filter(podcast => podcast.id !== podcastId);
        toast.success('Podcast episode deleted successfully');
        return { ...prev, podcasts };
      });
    } catch (error) {
      console.error('Delete podcast error:', error);
      toast.error('Failed to delete podcast');
    }
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
