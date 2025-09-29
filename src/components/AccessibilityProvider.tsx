import { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const { settings } = useAccessibility();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply high contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
      console.log('High contrast mode enabled - classes added to html and body');
    } else {
      root.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
      console.log('High contrast mode disabled - classes removed from html and body');
    }
    
    // Apply dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    
    // Apply font size
    root.style.setProperty('--accessible-font-size', `${settings.fontSize}px`);
    document.body.style.fontSize = `${settings.fontSize}px`;
    
    // Apply font size to all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label');
    textElements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${settings.fontSize}px`;
    });
    
    console.log(`Font size set to: ${settings.fontSize}px on ${textElements.length} elements`);
    
    // Apply language
    root.setAttribute('lang', settings.language);
    
    // Apply language-specific styling
    const languageClasses = ['lang-en', 'lang-es', 'lang-pt', 'lang-zh', 'lang-ht'];
    languageClasses.forEach(cls => root.classList.remove(cls));
    root.classList.add(`lang-${settings.language}`);
    
    // Apply accessible text class to body for dyslexia font
    if (settings.dyslexiaFont) {
      document.body.classList.add('accessible-text');
    } else {
      document.body.classList.remove('accessible-text');
    }
  }, [settings]);

  return <>{children}</>;
};