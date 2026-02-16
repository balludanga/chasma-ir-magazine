import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  height?: number;
}

export function QuillEditor({
  initialValue = '',
  onChange,
  height = 600,
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [_, setIsInitialized] = useState(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean'],
          ],
        },
      });

      quillRef.current = quill;
      setIsInitialized(true);

      // Set initial content
      if (initialValue) {
        // We need to be careful not to overwrite if it's already set (though in this effect it's first run)
        // Quill's clipboard dangerouslyPasteHTML is the standard way for HTML
        quill.clipboard.dangerouslyPasteHTML(initialValue);
      }

      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        if (onChange) {
          onChange(content);
        }
      });
    }
  }, []); // Run once on mount

  // Handle initialValue changes if needed (optional, depends on use case)
  // But usually for an editor, we don't want to reset content on prop change unless explicitly handled
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div 
        ref={containerRef} 
        style={{ height }} 
        className="text-base"
      />
    </div>
  );
}
