import fetch from 'node-fetch';
import { TranslateRequest, TranslateResponse } from '@shared/schema';

// Translation service using Google Translate API
export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  const { text, sourceLanguage = 'en', targetLanguage = 'ru' } = request;
  
  try {
    // For production, you'd use the Google Translate API or similar service
    // Here we're using a free alternative API as an example
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse response (Google Translate API format)
    // The response is a nested array where the first element contains translation segments
    let translatedText = '';
    if (data && Array.isArray(data) && data[0]) {
      translatedText = data[0]
        .filter(segment => segment && segment[0])
        .map(segment => segment[0])
        .join(' ');
    }
    
    return {
      originalText: text,
      translatedText: translatedText || 'Translation failed',
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Translation error:', error);
    
    // Return a fallback response
    return {
      originalText: text,
      translatedText: 'Translation service unavailable',
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString(),
    };
  }
}
