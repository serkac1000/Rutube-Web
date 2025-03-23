import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Languages, Square } from 'lucide-react';
import { PlayerStatus } from '@/types';

interface ControlPanelProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  urlError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  isPlaying: boolean;
  isMuted: boolean;
  isTranslating: boolean;
  playerStatus: PlayerStatus;
  togglePlay: () => void;
  toggleMute: () => void;
  startTranslation: () => void;
  stopTranslation: () => void;
}

export default function ControlPanel({
  videoUrl,
  setVideoUrl,
  urlError,
  handleSubmit,
  isPlaying,
  isMuted,
  isTranslating,
  playerStatus,
  togglePlay,
  toggleMute,
  startTranslation,
  stopTranslation,
}: ControlPanelProps) {
  const isPlayerReady = playerStatus !== 'not-loaded' && playerStatus !== 'loading' && playerStatus !== 'error';

  return (
    <section className="mb-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">
              YouTube Video URL
            </label>
            <div className="flex">
              <Input
                type="text"
                id="videoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-grow rounded-r-none"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90 rounded-l-none flex items-center gap-1"
              >
                <Play className="h-4 w-4" />
                <span>Load</span>
              </Button>
            </div>
            {urlError && (
              <p className="text-destructive text-sm mt-1">{urlError}</p>
            )}
          </div>
          
          <div className="flex flex-wrap justify-between gap-2">
            {/* Translation Controls */}
            <div className="flex items-center space-x-2">
              {!isTranslating ? (
                <Button
                  type="button"
                  variant="default"
                  className="bg-secondary hover:bg-secondary/90 text-white flex items-center gap-1"
                  onClick={startTranslation}
                  disabled={!isPlayerReady}
                >
                  <Languages className="h-4 w-4" />
                  <span>Start Translation</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-1"
                  onClick={stopTranslation}
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              )}
            </div>
            
            {/* Video Controls */}
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-1"
                onClick={togglePlay}
                disabled={!isPlayerReady}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Play</span>
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-1"
                onClick={toggleMute}
                disabled={!isPlayerReady}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Mute</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
