import { useState, useEffect } from 'react';
import { useTranslation } from './useTranslation';

interface AccessibilitySettings {
  highContrast: boolean;
  dyslexiaFont: boolean;
  fontSize: number;
  voiceEnabled: boolean;
  language: string;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  dyslexiaFont: false,
  fontSize: 16,
  voiceEnabled: false,
  language: 'en'
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const { translateElement } = useTranslation();

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply font size immediately
    const root = document.documentElement;
    root.style.setProperty('--accessible-font-size', `${settings.fontSize}px`);
    document.body.style.fontSize = `${settings.fontSize}px`;
    
    // Apply font size to all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label, a');
    textElements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${settings.fontSize}px`;
    });
    
    console.log(`Font size updated to: ${settings.fontSize}px on ${textElements.length} elements`);
    
    // Trigger translation when language changes
    if (settings.language !== 'en') {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        translateElement(mainContent, settings.language);
      }
    }
  }, [settings, translateElement]);


  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    resetSettings: () => setSettings(DEFAULT_SETTINGS)
  };
};