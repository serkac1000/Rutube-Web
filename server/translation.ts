import fetch from 'node-fetch';
import { TranslateRequest, TranslateResponse } from '@shared/schema';

// Define translation data types
interface TranslationSegment {
  [index: number]: string;
}

// Translation service
export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  const { text, sourceLanguage = 'en', targetLanguage = 'ru' } = request;
  
  console.log(`Translation request: "${text}" from ${sourceLanguage} to ${targetLanguage}`);
  
  try {
    // Google Translate unofficial API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    
    console.log(`Sending translation request to: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.warn(`Google Translate API failed: ${response.status} ${response.statusText}`);
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Translation API response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Parse response (Google Translate API format)
    // The response is a nested array where the first element contains translation segments
    let translatedText = '';
    if (data && Array.isArray(data) && data[0]) {
      // Type-safe approach to handle Google Translate response format
      const segments: Array<TranslationSegment> = data[0];
      
      translatedText = segments
        .filter((segment: TranslationSegment) => segment && segment[0])
        .map((segment: TranslationSegment) => segment[0])
        .join(' ');
      
      console.log(`Successfully translated to: "${translatedText}"`);
    } else {
      console.warn('Unexpected translation API response format:', data);
      throw new Error('Invalid translation response format');
    }
    
    return {
      originalText: text,
      translatedText: translatedText || 'Translation failed',
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Translation error:', error instanceof Error ? error.message : String(error));
    
    // Fallback option: Simple "dictionary-style" translation for common English words to Russian
    // This is only a backup and not meant to replace a proper translation service
    const simpleTranslations: Record<string, string> = {
      'hello': 'привет',
      'world': 'мир',
      'thank you': 'спасибо',
      'yes': 'да',
      'no': 'нет',
      'please': 'пожалуйста',
      'goodbye': 'до свидания',
      'excuse me': 'извините',
      'how are you': 'как дела',
      'good': 'хорошо',
      'bad': 'плохо',
      'help': 'помощь',
      'sorry': 'извините',
      'water': 'вода',
      'food': 'еда'
    };
    
    // Check if the text is in our simple dictionary (case insensitive)
    const lowerText = text.toLowerCase();
    const translatedText = simpleTranslations[lowerText] || 'Перевод недоступен'; // "Translation unavailable" in Russian
    
    console.log(`Using fallback translation for "${text}": "${translatedText}"`);
    
    return {
      originalText: text,
      translatedText: translatedText,
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString(),
    };
  }
}
