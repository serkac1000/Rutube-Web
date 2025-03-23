// YouTube Player states
export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

// YouTube player interface
export interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => PlayerState;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoUrl: () => string;
  getVideoData: () => { video_id: string };
}

// Translation entry
export interface TranslationEntry {
  id: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
}

// Status types
export type PlayerStatus = 
  | 'not-loaded' 
  | 'loading' 
  | 'ready' 
  | 'playing' 
  | 'paused' 
  | 'buffering' 
  | 'ended' 
  | 'error';

export type RecognitionStatus = 
  | 'inactive' 
  | 'active' 
  | 'error';

export type TranslationStatus = 
  | 'not-started' 
  | 'processing' 
  | 'active' 
  | 'stopped' 
  | 'error';
