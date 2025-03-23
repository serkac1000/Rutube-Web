import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extract YouTube video ID from URL
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7] && match[7].length === 11) ? match[7] : null;
}

// Format timestamp for display
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// Get player status text
export function getPlayerStatusText(status: string): string {
  switch (status) {
    case 'not-loaded':
      return 'Not loaded';
    case 'loading':
      return 'Loading...';
    case 'ready':
      return 'Ready';
    case 'playing':
      return 'Playing';
    case 'paused':
      return 'Paused';
    case 'buffering':
      return 'Buffering...';
    case 'ended':
      return 'Ended';
    case 'error':
      return 'Error';
    default:
      return status;
  }
}

// Get recognition status text
export function getRecognitionStatusText(status: string): string {
  switch (status) {
    case 'inactive':
      return 'Inactive';
    case 'active':
      return 'Active';
    case 'error':
      return 'Error';
    default:
      return status;
  }
}

// Get translation status text
export function getTranslationStatusText(status: string): string {
  switch (status) {
    case 'not-started':
      return 'Not started';
    case 'processing':
      return 'Processing';
    case 'active':
      return 'Active';
    case 'stopped':
      return 'Stopped';
    case 'error':
      return 'Error';
    default:
      return status;
  }
}
