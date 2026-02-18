import { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, Image as ImageIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Podcast } from '@/types';

const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');

interface PodcastEditorProps {
  podcast?: Podcast | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (podcast: Partial<Podcast>) => void;
  mode?: 'create' | 'edit';
}

export function PodcastEditor({ podcast, isOpen, onClose, onSave, mode = 'create' }: PodcastEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [duration, setDuration] = useState('30:00');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load podcast data if editing
  useEffect(() => {
    if (podcast && mode === 'edit') {
      setTitle(podcast.title);
      setDescription(podcast.description);
      setCoverImage(podcast.coverImage);
      setDuration(podcast.duration);
      setAudioUrl(podcast.audioUrl || '');
    } else {
      // Reset for new podcast
      setTitle('');
      setDescription('');
      setCoverImage('');
      setDuration('30:00');
      setAudioFile(null);
      setAudioUrl('');
    }
  }, [podcast, mode, isOpen]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file); // Server expects 'image' key

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setIsUploading(true);
      const toastId = toast.loading('Uploading audio file...');
      
      try {
        const url = await uploadFile(file);
        setAudioUrl(url);
        
        // Get audio duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);
          setDuration(`${mins}:${secs.toString().padStart(2, '0')}`);
        };
        
        toast.success('Audio file uploaded successfully');
      } catch (error) {
        console.error('Audio upload error:', error);
        toast.error('Failed to upload audio file');
        setAudioFile(null);
      } finally {
        setIsUploading(false);
        toast.dismiss(toastId);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const toastId = toast.loading('Uploading cover image...');
      
      try {
        const url = await uploadFile(file);
        setCoverImage(url);
        toast.success('Cover image uploaded successfully');
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload cover image');
      } finally {
        setIsUploading(false);
        toast.dismiss(toastId);
      }
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const podcastData: Partial<Podcast> = {
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop',
      duration,
      publishedAt: new Date().toISOString().split('T')[0],
      audioUrl: audioUrl || undefined,
    };

    onSave(podcastData);
    toast.success(`Podcast ${mode === 'create' ? 'created' : 'updated'} successfully!`);
    onClose();
  };

  const formatDuration = (value: string) => {
    // Format as MM:SS
    const clean = value.replace(/[^0-9:]/g, '');
    const parts = clean.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return clean;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Editor */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#1e3a5f] text-white">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'New Podcast Episode' : 'Edit Podcast Episode'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <Label>Episode Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter episode title..."
              className="text-lg font-semibold"
            />
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
                  className="w-full h-48 object-cover rounded-lg"
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
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Episode description..."
              rows={4}
            />
          </div>

          {/* Duration */}
          <div>
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration (MM:SS)
            </Label>
            <Input
              value={duration}
              onChange={(e) => setDuration(formatDuration(e.target.value))}
              placeholder="30:00"
            />
          </div>

          {/* Audio Upload */}
          <div>
            <Label>Audio File</Label>
            <div className="space-y-2">
              {audioUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    className="w-full"
                    controls
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={audioFile ? audioFile.name : audioUrl ? 'Audio file uploaded' : ''}
                  readOnly
                  placeholder="No audio file selected..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: MP3, WAV, M4A. Max file size: 100MB.
              </p>
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
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={isUploading}
            >
              <Save className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Save Episode'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
