import { useState, useCallback } from 'react';
import { TranslationStatus, TranslationEntry } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { nanoid } from 'nanoid';

interface UseTranslationProps {
  sourceLanguage?: string;
  targetLanguage?: string;
}

export const useTranslation = ({
  sourceLanguage = 'en',
  targetLanguage = 'ru',
}: UseTranslationProps = {}) => {
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>('not-started');
  const [isTranslating, setIsTranslating] = useState(false);
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Translate text
  const translateText = useCallback(async (text: string, videoId?: string) => {
    if (!text.trim()) return;
    
    setTranslationStatus('processing');
    
    try {
      const response = await apiRequest('POST', '/api/translate', {
        text,
        sourceLanguage,
        targetLanguage,
        videoId,
      });
      
      const data = await response.json();
      
      const newEntry: TranslationEntry = {
        id: nanoid(),
        originalText: data.originalText,
        translatedText: data.translatedText,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      
      setEntries(prev => [...prev, newEntry]);
      setTranslationStatus('active');
      setError(null);
      
      return newEntry;
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate text');
      setTranslationStatus('error');
      return null;
    }
  }, [sourceLanguage, targetLanguage]);

  // Start translation service
  const startTranslation = useCallback(() => {
    setIsTranslating(true);
    setTranslationStatus('active');
    setError(null);
  }, []);

  // Stop translation service
  const stopTranslation = useCallback(() => {
    setIsTranslating(false);
    setTranslationStatus('stopped');
  }, []);

  // Clear all translation entries
  const clearTranslations = useCallback(() => {
    setEntries([]);
  }, []);

  return {
    translationStatus,
    isTranslating,
    entries,
    error,
    translateText,
    startTranslation,
    stopTranslation,
    clearTranslations,
  };
};
