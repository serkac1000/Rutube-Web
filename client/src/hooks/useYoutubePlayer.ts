import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerState, PlayerStatus, YouTubePlayer } from '@/types';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          height: string;
          width: string;
          videoId?: string;
          playerVars?: {
            playsinline?: number;
            enablejsapi?: number;
            modestbranding?: number;
            rel?: number;
            controls?: number;
            autoplay?: number;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYoutubePlayer = (elementId: string) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('not-loaded');
  const [isApiReady, setIsApiReady] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const playerReadyRef = useRef(false);

  // Check if YouTube API is ready
  useEffect(() => {
    const checkYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
      } else {
        // Set up the global callback for when the API is ready
        window.onYouTubeIframeAPIReady = () => {
          setIsApiReady(true);
        };
      }
    };

    checkYouTubeAPI();
  }, []);

  // Extract YouTube video ID from URL
  const extractVideoId = useCallback((url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }, []);

  // Load video by URL
  const loadVideoByUrl = useCallback((url: string) => {
    const id = extractVideoId(url);
    if (!id) {
      setError('Invalid YouTube URL');
      return false;
    }
    
    setVideoId(id);
    setError(null);
    return true;
  }, [extractVideoId]);

  // Initialize or update player when video ID changes
  useEffect(() => {
    if (!isApiReady || !videoId) return;

    const initializePlayer = () => {
      setPlayerStatus('loading');
      
      if (player && playerReadyRef.current) {
        // Update existing player
        player.loadVideoById(videoId);
        return;
      }
      
      try {
        const newPlayer = new window.YT.Player(elementId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            controls: 1,
          },
          events: {
            onReady: (event) => {
              playerReadyRef.current = true;
              setPlayerStatus('ready');
              setPlayer(event.target);
            },
            onStateChange: (event) => {
              switch (event.data) {
                case PlayerState.PLAYING:
                  setPlayerStatus('playing');
                  setIsPlaying(true);
                  break;
                case PlayerState.PAUSED:
                  setPlayerStatus('paused');
                  setIsPlaying(false);
                  break;
                case PlayerState.ENDED:
                  setPlayerStatus('ended');
                  setIsPlaying(false);
                  break;
                case PlayerState.BUFFERING:
                  setPlayerStatus('buffering');
                  break;
                case PlayerState.CUED:
                  setPlayerStatus('ready');
                  break;
              }
            },
            onError: (event) => {
              setPlayerStatus('error');
              setError('Error loading video');
              console.error('YouTube player error:', event.data);
            },
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setPlayerStatus('error');
        setError('Failed to initialize player');
      }
    };

    initializePlayer();
  }, [isApiReady, videoId, player, elementId]);

  // Play/pause toggle
  const togglePlay = useCallback(() => {
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  // Mute/unmute toggle
  const toggleMute = useCallback(() => {
    if (!player) return;
    
    if (player.isMuted()) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [player]);

  return {
    player,
    playerStatus,
    isApiReady,
    isPlaying,
    isMuted,
    error,
    loadVideoByUrl,
    togglePlay,
    toggleMute,
  };
};
