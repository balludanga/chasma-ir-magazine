import { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');

interface WriterApplicationDialogProps {
  children: React.ReactNode;
}

export function WriterApplicationDialog({ children }: WriterApplicationDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [biodata, setBiodata] = useState<File | null>(null);
  const [answers, setAnswers] = useState({
    experience: '',
    topics: '',
    motivation: ''
  });
  const [demoContent, setDemoContent] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBiodata(e.target.files[0]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!biodata) {
        toast.error('Please upload your biodata/CV');
        return;
      }
      if (!answers.experience || !answers.topics || !answers.motivation) {
        toast.error('Please answer all questions');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!demoContent) {
      toast.error('Please provide a demo article');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', user.id);
    if (biodata) {
      formData.append('biodata', biodata);
    }
    formData.append('answers', JSON.stringify(answers));
    formData.append('demoContent', demoContent);

    try {
      const response = await fetch(`${API_URL}/writer-requests`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully!');
      setIsOpen(false);
      setStep(1);
      // Reset form
      setBiodata(null);
      setAnswers({ experience: '', topics: '', motivation: '' });
      setDemoContent('');
    } catch (error: any) {
      console.error('Application error:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4 py-4">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Before you apply</p>
          <p>Please ensure your profile is complete. We're looking for passionate writers who can contribute high-quality content.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">1. Upload Biodata / CV</Label>
          <p className="text-sm text-gray-500 mb-2">Upload your resume or portfolio summary (PDF, DOCX)</p>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#1e3a5f] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              {biodata ? biodata.name : 'Click to upload file'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">2. Screening Questions</Label>
          
          <div className="space-y-1">
            <Label htmlFor="experience">What is your writing experience?</Label>
            <Textarea 
              id="experience" 
              placeholder="Tell us about your previous work..." 
              value={answers.experience}
              onChange={(e) => setAnswers({...answers, experience: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="topics">What topics do you want to cover?</Label>
            <Input 
              id="topics" 
              placeholder="e.g., Technology, Culture, Design..." 
              value={answers.topics}
              onChange={(e) => setAnswers({...answers, topics: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="motivation">Why do you want to join us?</Label>
            <Textarea 
              id="motivation" 
              placeholder="Share your motivation..." 
              value={answers.motivation}
              onChange={(e) => setAnswers({...answers, motivation: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">3. Demo Article</Label>
        <p className="text-sm text-gray-500">
          Please provide a short sample article (300-500 words) to demonstrate your writing style.
        </p>
        <Textarea 
          className="min-h-[300px] font-mono text-sm"
          placeholder="# Title\n\nWrite your article content here..."
          value={demoContent}
          onChange={(e) => setDemoContent(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Become a Writer Application</DialogTitle>
          <DialogDescription>
            Step {step} of 2: {step === 1 ? 'Personal Information' : 'Demo Article'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? renderStep1() : renderStep2()}

        <DialogFooter className="flex justify-between sm:justify-between">
          {step === 1 ? (
            <div className="flex w-full justify-end">
               <Button onClick={handleNextStep}>Next Step</Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}