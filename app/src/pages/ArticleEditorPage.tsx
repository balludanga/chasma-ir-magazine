import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Send, Upload, Wand2 } from 'lucide-react';
import type { Article } from '@/types';
import { QuillEditor } from '@/components/editor/QuillEditor';

export function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { articles, categories, createArticle, updateArticle } = useBlog();
  
  const contentRef = useRef('');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [initialContent, setInitialContent] = useState('');
  const [isLoading, setIsLoading] = useState(!!id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    const toastId = toast.loading('Uploading image...');

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setCoverImage(data.url);
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handleAutoFillImage = () => {
    if (!title.trim()) {
        toast.error("Please enter a title first");
        return;
    }
    
    const safeTitle = encodeURIComponent(title.trim());
    const url = `https://image.pollinations.ai/prompt/${safeTitle}`;
    
    setCoverImage(url);
    toast.success('Generated cover image from title');
  };

  useEffect(() => {
    if (id) {
      const article = articles.find(a => a.id === id);
      if (article) {
        setTitle(article.title);
        setExcerpt(article.excerpt);
        setCategory(article.category);
        setCoverImage(article.coverImage);
        setReadTime(article.readTime);
        setInitialContent(article.content);
        contentRef.current = article.content;
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [id, articles]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || (user.role !== 'writer' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Writer Access Only</h2>
          <p className="text-gray-600 mb-6">
            You need to be a writer to access the editor.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    contentRef.current = newContent;
  };

  const handleSave = (newStatus: 'draft' | 'pending' | 'published') => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!category) {
        toast.error('Please select a category');
        return;
    }
    
    const content = contentRef.current;
    if (!content || !content.trim()) {
      toast.error('Please add content');
      return;
    }

    const articleData: Partial<Article> = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category,
      coverImage: coverImage || (title.trim() ? `https://image.pollinations.ai/prompt/${encodeURIComponent(title.trim())}` : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop'),
      readTime,
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : undefined,
    };

    if (id) {
      updateArticle(id, articleData);
      toast.success('Article updated successfully');
    } else {
      createArticle(articleData);
      toast.success('Article created successfully');
    }
    
    if (user?.role === 'admin') {
        navigate('/admin-dashboard');
    } else {
        navigate('/writer-dashboard');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              {id ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
             
            <Button variant="outline" onClick={() => handleSave('draft')}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            {user?.role === 'admin' ? (
              <Button onClick={() => handleSave('published')} className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            ) : (
              <Button onClick={() => handleSave('pending')} className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">
                <Send className="w-4 h-4 mr-2" />
                Submit for Review
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-300 h-auto"
            />
            
            <div className="min-h-[600px]">
                <QuillEditor
                  initialValue={contentRef.current || initialContent}
                  onChange={handleContentChange}
                  height={600}
                />
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <h3 className="font-semibold text-gray-900">Publishing Details</h3>
                
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[180px] overflow-y-auto">
                            {categories.map(c => (
                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea 
                        value={excerpt} 
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Short summary..."
                        className="h-32 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex gap-2">
                        <Input 
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://..."
                            className="flex-1"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload Image"
                        >
                            <Upload className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleAutoFillImage}
                            title="Auto-fill from Title"
                        >
                            <Wand2 className="w-4 h-4" />
                        </Button>
                    </div>
                    {coverImage && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-gray-100">
                            <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                     <Label>Read Time (minutes)</Label>
                     <Input 
                        type="number"
                        min={1}
                        value={readTime}
                        onChange={(e) => setReadTime(parseInt(e.target.value) || 1)}
                     />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
