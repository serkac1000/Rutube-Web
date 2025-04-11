import { PlayCircle, AlertCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import { PlayerStatus } from "@/types";

interface VideoPlayerProps {
  containerId: string;
  status: PlayerStatus;
  error: string | null;
  subtitles: string | null;
}

export default function VideoPlayer({ containerId, status, error, subtitles }: VideoPlayerProps) {
  const isLoading = status === 'loading' || status === 'not-loaded';
  const hasError = status === 'error' || !!error;
  
  return (
    <section className="mb-6">
      <div 
        className="w-full bg-black relative overflow-hidden rounded-lg shadow-lg"
        style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
      >
        {/* YouTube iframe will be inserted here */}
        <div 
          id={containerId} 
          className="absolute top-0 left-0 w-full h-full"
        />
        {/* Subtitles container */}
        <div
          id="subtitles-container"
          className="absolute bottom-0 left-0 w-full p-4 text-center text-white bg-black bg-opacity-50 overflow-hidden z-20"
        >
          <p className="text-lg leading-tight"
            style={{whiteSpace: 'pre-wrap'}}
          >
            {subtitles && subtitles.trim() !== '' ? subtitles : ''}
          </p>
        </div>

        {/* Loading state overlay */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className="text-center">
              <div className="inline-block animate-pulse">
                <PlayCircle className="text-primary h-16 w-16" />
              </div>
              <p className="text-white mt-3">Loading video player...</p>
            </div>
          </div>
        )}
        
        {/* Error state overlay */}
        {hasError && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className="text-center">
              <AlertCircle className="text-primary h-16 w-16 mx-auto" />
              <p className="text-white mt-3">
                {error || 'Failed to load video. Please check the URL and try again.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section >
  );
}
