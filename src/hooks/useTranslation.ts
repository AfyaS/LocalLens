import { useState, useEffect, useCallback } from 'react';

interface TranslationCache {
  [key: string]: string;
}

interface TranslationOptions {
  text: string;
  targetLanguage: string;
  cacheKey?: string;
}

const API_BASE_URL = 'https://community-clarity-func-v2.azurewebsites.net/api';

export const useTranslation = () => {
  const [cache, setCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = useCallback(async ({ 
    text, 
    targetLanguage, 
    cacheKey 
  }: TranslationOptions): Promise<string> => {
    // Return original text if target language is English
    if (targetLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKeyToUse = cacheKey || `${text}-${targetLanguage}`;
    if (cache[cacheKeyToUse]) {
      return cache[cacheKeyToUse];
    }

    // If text is empty or just whitespace, return as is
    if (!text || text.trim() === '') {
      return text;
    }

    try {
      setIsTranslating(true);
      
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const result = await response.json();
      const translatedText = result.translatedText || text;

      // Cache the result
      setCache(prev => ({
        ...prev,
        [cacheKeyToUse]: translatedText
      }));

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [cache]);

  const translateElement = useCallback(async (element: HTMLElement, targetLanguage: string) => {
    if (targetLanguage === 'en') {
      return; // No translation needed for English
    }

    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          if (text && text.length > 0 && !node.parentElement?.classList.contains('no-translate')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    // Translate each text node
    for (const textNode of textNodes) {
      const originalText = textNode.textContent || '';
      if (originalText.trim()) {
        try {
          const translatedText = await translateText({
            text: originalText,
            targetLanguage,
            cacheKey: `${originalText}-${targetLanguage}`
          });
          
          if (translatedText !== originalText) {
            textNode.textContent = translatedText;
          }
        } catch (error) {
          console.error('Error translating text node:', error);
        }
      }
    }
  }, [translateText]);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return {
    translateText,
    translateElement,
    clearCache,
    isTranslating
  };
};
