// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'reader' | 'writer' | 'admin';
  bio?: string;
  joinedAt: string;
  subscribers?: number;
  isActive?: boolean;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: User;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: Comment[];
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  status: 'published' | 'draft' | 'pending';
  views: number;
}

// Comment Types
export interface Comment {
  id: string;
  articleId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  writerId: string;
  subscriberId: string;
  subscribedAt: string;
}

// Like Types
export interface Like {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  articleCount: number;
  isActive: boolean;
}

// Podcast Types
export interface Podcast {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  duration: string;
  publishedAt: string;
  audioUrl?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'subscribe' | 'new_article';
  message: string;
  read: boolean;
  createdAt: string;
}

// Site Settings Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  primaryColor: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// Auth Context Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, role?: 'reader' | 'writer' | 'admin') => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'reader' | 'writer') => Promise<void>;
  logout: () => void;
}

// Blog Context Types
export interface BlogState {
  articles: Article[];
  categories: Category[];
  podcasts: Podcast[];
  likedArticles: string[];
  subscriptions: string[];
  comments: Comment[];
  siteSettings: SiteSettings;
  users: User[];
}

export interface BlogContextType extends BlogState {
  likeArticle: (articleId: string) => void;
  unlikeArticle: (articleId: string) => void;
  addComment: (articleId: string, content: string) => void;
  subscribeToWriter: (writerId: string) => void;
  unsubscribeFromWriter: (writerId: string) => void;
  isArticleLiked: (articleId: string) => boolean;
  isSubscribedToWriter: (writerId: string) => boolean;
  getArticleById: (id: string) => Article | undefined;
  getArticlesByCategory: (category: string) => Article[];
  getArticlesByWriter: (writerId: string) => Article[];
  getLikedArticles: () => Article[];
  getSubscribedWritersArticles: () => Article[];
  shareArticle: (article: Article) => void;
  // Admin functions
  updateArticleStatus: (articleId: string, status: 'published' | 'draft' | 'pending') => void;
  deleteArticle: (articleId: string) => void;
  updateUserStatus: (userId: string, isActive: boolean) => void;
  addCategory: (category: Omit<Category, 'id' | 'articleCount'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  // Article CRUD
  createArticle: (article: Partial<Article>) => void;
  updateArticle: (articleId: string, article: Partial<Article>) => void;
  // Podcast CRUD
  createPodcast: (podcast: Partial<Podcast>) => void;
  updatePodcast: (podcastId: string, podcast: Partial<Podcast>) => void;
  deletePodcast: (podcastId: string) => void;
}
