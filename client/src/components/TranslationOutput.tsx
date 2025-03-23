import { useState, useRef, useEffect } from 'react';
import { Subtitles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TranslationEntry } from '@/types';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TranslationOutputProps {
  entries: TranslationEntry[];
}

export default function TranslationOutput({ entries }: TranslationOutputProps) {
  const [activeTab, setActiveTab] = useState<'english' | 'russian'>('english');
  const [autoScroll, setAutoScroll] = useState(true);
  const translationAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && translationAreaRef.current && entries.length > 0) {
      translationAreaRef.current.scrollTop = translationAreaRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);
  
  return (
    <section>
      <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center border-b border-border px-4 py-3">
          <h2 className="text-lg font-medium">Translation</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="autoScrollToggle" className="text-sm">
              Auto-scroll
            </Label>
            <Switch
              id="autoScrollToggle"
              checked={autoScroll}
              onCheckedChange={setAutoScroll}
            />
          </div>
        </div>
        
        <div className="flex border-b border-border">
          <button
            className={cn(
              "flex-1 py-2 px-4 text-center border-b-2 font-medium transition-all",
              activeTab === 'english' 
                ? "border-primary" 
                : "border-transparent hover:text-foreground hover:border-muted"
            )}
            onClick={() => setActiveTab('english')}
          >
            English
          </button>
          <button
            className={cn(
              "flex-1 py-2 px-4 text-center border-b-2 font-medium transition-all",
              activeTab === 'russian' 
                ? "border-primary" 
                : "border-transparent hover:text-foreground hover:border-muted"
            )}
            onClick={() => setActiveTab('russian')}
          >
            Russian
          </button>
        </div>
        
        <div 
          ref={translationAreaRef}
          className="h-64 overflow-y-auto p-4 space-y-4 translation-area"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border) var(--background)'
          }}
        >
          {entries.length > 0 ? (
            <>
              {/* English transcript container */}
              <div className={cn("space-y-4", activeTab !== 'english' && "hidden")}>
                {entries.map(entry => (
                  <div key={`en-${entry.id}`} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <p>{entry.originalText}</p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Russian translation container */}
              <div className={cn("space-y-4", activeTab !== 'russian' && "hidden")}>
                {entries.map(entry => (
                  <div key={`ru-${entry.id}`} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <p>{entry.translatedText}</p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Subtitles className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="mt-2 text-muted-foreground">No translation data available yet.</p>
              <p className="text-sm text-muted-foreground">
                Start the video and enable translation to see content here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
