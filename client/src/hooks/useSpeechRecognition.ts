import { useState, useEffect, useCallback } from 'react';
import { RecognitionStatus } from '@/types';

interface UseSpeechRecognitionProps {
  onTranscript: (text: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: (event: Event) => void;
}

// Define the global SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  var SpeechRecognition: SpeechRecognitionConstructor | undefined;
  var webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
}

export const useSpeechRecognition = ({
  onTranscript,
  language = 'en-US',
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionProps) => {
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>('inactive');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser');
      setRecognitionStatus('error');
      return;
    }
    
    try {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = interimResults;
      recognitionInstance.lang = language;
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        try {
          const resultIndex = event.resultIndex;
          const result = event.results[resultIndex];
          
          console.log('Speech recognition result:', result);
          
          if (result && result[0]) {
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            
            console.log(`Speech detected: "${transcript}" (confidence: ${confidence.toFixed(2)})`);
            
            // Only send final results to translation (unless interimResults is true)
            if (result.isFinal || interimResults) {
              console.log(`Sending transcript for processing: "${transcript}" (isFinal: ${result.isFinal})`);
              onTranscript(transcript);
            }
          }
        } catch (error) {
          console.error('Error processing speech recognition result:', error);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setError('Error during speech recognition');
        setRecognitionStatus('error');
      };
      
      recognitionInstance.onend = () => {
        // If we're supposed to be listening but recognition stopped,
        // restart it (unless we explicitly stopped it)
        if (isListening) {
          recognitionInstance.start();
        } else {
          setRecognitionStatus('inactive');
        }
      };
      
      setRecognition(recognitionInstance);
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setError('Failed to initialize speech recognition');
      setRecognitionStatus('error');
    }
  }, [language, continuous, interimResults, onTranscript, isListening]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      setRecognitionStatus('active');
      setError(null);
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
      setRecognitionStatus('error');
    }
  }, [recognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
      setRecognitionStatus('inactive');
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  }, [recognition]);

  return {
    recognitionStatus,
    isListening,
    error,
    startListening,
    stopListening,
  };
};
