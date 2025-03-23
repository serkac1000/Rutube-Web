import { useState, useRef, useEffect } from 'react';
import { Subtitles, Volume2, Languages, TextSelect } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TranslationEntry } from '@/types';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

  // Debug - log entries when they change
  useEffect(() => {
    console.log('TranslationOutput - Current entries:', entries);
  }, [entries]);

  return (
    <section>
      <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center border-b border-border px-4 py-3">
          <div className="flex items-center">
            <Languages className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Translation</h2>
            <Badge variant="outline" className="ml-2">
              {entries.length} entries
            </Badge>
          </div>
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
              "flex-1 py-2 px-4 text-center border-b-2 font-medium transition-all flex items-center justify-center",
              activeTab === 'english' 
                ? "border-primary text-primary" 
                : "border-transparent hover:text-foreground hover:border-muted"
            )}
            onClick={() => setActiveTab('english')}
          >
            <Volume2 className="mr-1.5 h-4 w-4" />
            English
          </button>
          <button
            className={cn(
              "flex-1 py-2 px-4 text-center border-b-2 font-medium transition-all flex items-center justify-center",
              activeTab === 'russian' 
                ? "border-primary text-primary" 
                : "border-transparent hover:text-foreground hover:border-muted"
            )}
            onClick={() => setActiveTab('russian')}
          >
            <Languages className="mr-1.5 h-4 w-4" />
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
          {entries && entries.length > 0 ? (
            <>
              {/* English transcript container */}
              <div className={cn("space-y-4", activeTab !== 'english' && "hidden")}>
                {entries.map((entry) => (
                  <div key={`en-${entry.id}`} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{entry.originalText}</p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Russian translation container */}
              <div className={cn("space-y-4", activeTab !== 'russian' && "hidden")}>
                {entries.map((entry) => (
                  <div key={`ru-${entry.id}`} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-primary">{entry.translatedText}</p>
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
              <TextSelect className="h-12 w-12 text-muted-foreground mx-auto" />
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