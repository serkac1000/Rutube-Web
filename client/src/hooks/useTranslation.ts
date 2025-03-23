import { useState, useCallback, useEffect } from 'react';
import { TranslationStatus, TranslationEntry } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Effect to test the translation endpoint on mount
  useEffect(() => {
    const testTranslation = async () => {
      try {
        console.log('Testing translation endpoint...');
        const response = await fetch('/api/translate/test');
        
        if (!response.ok) {
          console.warn('Translation test endpoint failed:', response.status, response.statusText);
        } else {
          const data = await response.json();
          console.log('Translation test endpoint response:', data);
        }
      } catch (err) {
        console.error('Error testing translation endpoint:', err);
      }
    };
    
    // Run the test
    testTranslation();
  }, []);

  // Translate text
  const translateText = useCallback(async (text: string, videoId?: string) => {
    if (!text.trim()) return;
    
    setTranslationStatus('processing');
    console.log(`Attempting to translate: "${text}"`);
    
    try {
      // Make the translation request
      const response = await apiRequest('POST', '/api/translate', {
        text,
        sourceLanguage,
        targetLanguage,
        videoId,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Translation request failed: ${response.status} ${response.statusText}`, errorText);
        setError(`Translation failed: ${response.status} ${response.statusText}`);
        setTranslationStatus('error');
        
        toast({
          title: "Translation Error",
          description: "There was a problem with the translation service.",
          variant: "destructive"
        });
        
        return null;
      }
      
      // Parse the response
      const data = await response.json();
      console.log('Translation response:', data);
      
      // Create a new entry object
      const newEntry: TranslationEntry = {
        id: nanoid(),
        originalText: data.originalText,
        translatedText: data.translatedText,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      
      // Add it to our entries
      setEntries(prev => [...prev, newEntry]);
      setTranslationStatus('active');
      setError(null);
      
      return newEntry;
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate text');
      setTranslationStatus('error');
      
      toast({
        title: "Translation Error",
        description: "Failed to connect to translation service.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [sourceLanguage, targetLanguage, toast]);

  // Start translation service
  const startTranslation = useCallback(() => {
    setIsTranslating(true);
    setTranslationStatus('active');
    setError(null);
    
    toast({
      title: "Translation Started",
      description: "Speech will now be translated in real-time.",
    });
  }, [toast]);

  // Stop translation service
  const stopTranslation = useCallback(() => {
    setIsTranslating(false);
    setTranslationStatus('stopped');
    
    toast({
      title: "Translation Stopped",
      description: "Real-time translation has been disabled.",
    });
  }, [toast]);

  // Clear all translation entries
  const clearTranslations = useCallback(() => {
    setEntries([]);
    
    toast({
      title: "Translations Cleared",
      description: "All translation entries have been removed.",
    });
  }, [toast]);

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
