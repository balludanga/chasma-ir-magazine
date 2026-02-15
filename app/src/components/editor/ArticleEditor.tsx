import { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import { X, Upload, Save, Eye, Send, Image as ImageIcon, Tag, Clock, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Article, Category } from '@/types';
import 'quill/dist/quill.snow.css';

interface ArticleEditorProps {
  article?: Article | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<Article>) => void;
  mode?: 'create' | 'edit';
}

export function ArticleEditor({ article, categories, isOpen, onClose, onSave, mode = 'create' }: ArticleEditorProps) {
  const [quill, setQuill] = useState<Quill | undefined>(undefined);
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen && editorRef.current && !quill) {
      const q = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your article content here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      });
      setQuill(q);
    }
  }, [isOpen, editorRef.current, quill]);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'pending' | 'published'>('draft');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load article data if editing
  useEffect(() => {
    if (article && mode === 'edit') {
      setTitle(article.title);
      setExcerpt(article.excerpt);
      setCategory(article.category);
      setCoverImage(article.coverImage);
      setReadTime(article.readTime);
      setTags(article.tags);
      setStatus(article.status);
      
      if (quill) {
        quill.root.innerHTML = article.content;
      }
    } else {
      // Reset for new article
      setTitle('');
      setExcerpt('');
      setCategory('');
      setCoverImage('');
      setReadTime(5);
      setTags([]);
      setStatus('draft');
      if (quill) {
        quill.root.innerHTML = '';
      }
    }
  }, [article, mode, quill, isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to server/cloud storage
      // For demo, we'll use a placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        toast.success('Cover image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url);
    }
  };

  const handleInsertVideo = () => {
    const url = window.prompt('Enter video URL (YouTube, Vimeo):');
    if (url && quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'video', url);
    }
  };

  const handleSave = (saveStatus: 'draft' | 'pending' | 'published') => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!quill || !quill.root.innerHTML.trim() || quill.root.innerHTML === '<p><br></p>') {
      toast.error('Please add some content');
      return;
    }

    const articleData: Partial<Article> = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: quill.root.innerHTML,
      category,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop',
      readTime,
      tags,
      status: saveStatus,
      publishedAt: saveStatus === 'published' ? new Date().toISOString().split('T')[0] : undefined,
    };

    onSave(articleData);
    toast.success(`Article ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    onClose();
  };

  const generateExcerpt = () => {
    if (quill) {
      const text = quill.getText().slice(0, 200);
      setExcerpt(text + (text.length >= 200 ? '...' : ''));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Editor */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#1e3a5f] text-white">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'New Article' : 'Edit Article'}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title */}
              <div>
                <Label>Article Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title..."
                  className="text-lg font-semibold"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <Label>Content</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleInsertImage}>
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Image
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={handleInsertVideo}>
                      Video
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { const url = window.prompt('Enter URL:'); if (url && quill) { const range = quill.getSelection(true); quill.insertText(range.index, url); quill.formatText(range.index, url.length, 'link', url); } }}>
                      Link
                    </Button>
                  </div>
                  <div ref={editorRef} className="h-96" />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between">
                  <Label>Excerpt</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateExcerpt}>
                    Auto-generate
                  </Button>
                </div>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the article..."
                  rows={3}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Category */}
              <div>
                <Label className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cover Image */}
              <div>
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Cover Image
                </Label>
                <div className="space-y-2">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Image URL..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Read Time */}
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Read Time (minutes)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                />
              </div>

              {/* Tags */}
              <div>
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave('pending')}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit for Review
            </Button>
            <Button
              onClick={() => handleSave('published')}
              className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg" />
            )}
            <h1 className="text-3xl font-bold">{title || 'Untitled Article'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{category || 'No category'}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
            <div 
              className="prose max-w-none article-content"
              dangerouslySetInnerHTML={{ __html: quill?.root.innerHTML || '' }}
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">#{tag}</Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
