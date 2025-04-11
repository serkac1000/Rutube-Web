import { useState, useRef, useEffect } from 'react';
// Only importing icons that we actually use
import { AlertCircle } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import ControlPanel from '@/components/ControlPanel';
import StatusPanel from '@/components/StatusPanel';
import TranslationOutput from '@/components/TranslationOutput';
import { useYoutubePlayer } from '@/hooks/useYoutubePlayer';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/components/ThemeProvider';
import { extractVideoId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlayerStatus, RecognitionStatus, TranslationStatus } from '@/types';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const playerContainerId = 'youtube-player';
  
  // Theme handling
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // YouTube player hook
  const {
    player,
    playerStatus,
    isPlaying,
    isMuted,
    error: playerError,
    loadVideoByUrl,
    togglePlay,
    toggleMute,
    subtitles,
    enableSubtitles,
    disableSubtitles,
  } = useYoutubePlayer(playerContainerId);
  
  // Translation hook
  const {
    translationStatus,
    isTranslating,
    entries,
    translateText,
    startTranslation,
    stopTranslation,
    clearTranslations,
  } = useTranslation();
  
  // Speech recognition hook with improved handling
  const {
    recognitionStatus,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscript: (text) => {
      console.log(`Speech recognized: "${text}"`);
      if (isTranslating && text.trim()) {
        console.log(`Sending for translation: "${text}"`);
        
        // Get video ID if player is available
        const videoId = player?.getVideoData()?.video_id;
        console.log(`Current video ID: ${videoId || 'unavailable'}`);
        
        // Send for translation
        translateText(text, videoId)
          .then(entry => {
            if (entry) {
              console.log(`Translation successful:`, entry);
            } else {
              console.warn(`Translation failed for: "${text}"`);
            }
          })
          .catch(err => {
            console.error(`Error during translation:`, err);
          });
      } else {
        console.log(`Not translating: isTranslating=${isTranslating}, text=${text.trim() ? 'has content' : 'empty'}`);
      }
    },
    language: 'en-US',
    continuous: true,
    interimResults: true,
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }
    
    setUrlError(null);
    const success = loadVideoByUrl(videoUrl);
    
    // Reset translation if new video is loaded
    if (success && isTranslating) {
      stopTranslation();
      stopListening();
      clearTranslations();
    }
  };
  
  // Handle start translation button
  const handleStartTranslation = () => {
    startTranslation();
    startListening();
  };
  
  // Handle stop translation button
  const handleStopTranslation = () => {
    stopTranslation();
    stopListening();
  };
  
  return (
    <div className="bg-background text-foreground font-sans transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-primary text-3xl font-bold font-condensed">Rutube1</span>
              <span className="ml-2 text-sm bg-secondary text-white px-2 py-1 rounded">Beta</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? (
                <span className="material-icons">light_mode</span>
              ) : (
                <span className="material-icons">dark_mode</span>
              )}
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">
            Watch YouTube videos with real-time Russian translation
          </p>
        </header>
        
        {/* Video Player */}
        <VideoPlayer 
          containerId={playerContainerId} 
          status={playerStatus} 
          error={playerError}
          subtitles={subtitles}
          enableSubtitles={enableSubtitles}
          disableSubtitles={disableSubtitles}

        />
        
        {/* Controls */}
        <ControlPanel
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          urlError={urlError}
          handleSubmit={handleSubmit}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isTranslating={isTranslating}
          playerStatus={playerStatus}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          startTranslation={handleStartTranslation}
          stopTranslation={handleStopTranslation}
        />
        
        {/* Status Panel */}
        <StatusPanel
          playerStatus={playerStatus}
          recognitionStatus={recognitionStatus}
          translationStatus={translationStatus}
        />
        
        {/* Translation Output */}
        <TranslationOutput entries={entries} />
        
        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Rutube1 - YouTube with Russian Translation</p>
          <p className="mt-1">© 2023 All rights reserved</p>
        </footer>
      </div>
    </div>
  );
}
