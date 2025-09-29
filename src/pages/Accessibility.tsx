import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Type, 
  Palette, 
  Languages,
  Headphones,
  MessageSquare,
  Settings,
  Play,
  ExternalLink
} from "lucide-react";

const AccessibilityPage = () => {
  const { settings, updateSetting } = useAccessibility();
  
  // Local state for UI consistency
  const [highContrast, setHighContrast] = useState(settings.highContrast);
  const [dyslexiaFont, setDyslexiaFont] = useState(settings.dyslexiaFont);
  const [fontSize, setFontSize] = useState([settings.fontSize]);
  const [language, setLanguage] = useState(settings.language);

  // Sync with global settings
  useEffect(() => {
    setHighContrast(settings.highContrast);
    setDyslexiaFont(settings.dyslexiaFont);
    setFontSize([settings.fontSize]);
    setLanguage(settings.language);
  }, [settings]);

  // Update handlers

  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    updateSetting('highContrast', checked);
    
    // Apply high contrast immediately
    const root = document.documentElement;
    const body = document.body;
    
    if (checked) {
      // Enable high contrast mode
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
      
      // Force high contrast colors immediately
      root.style.setProperty('--background', '0 0% 0%', 'important');
      root.style.setProperty('--foreground', '0 0% 100%', 'important');
      root.style.setProperty('--card', '0 0% 5%', 'important');
      root.style.setProperty('--card-foreground', '0 0% 100%', 'important');
      root.style.setProperty('--border', '0 0% 100%', 'important');
      
      // Apply to body
      body.style.backgroundColor = '#000000';
      body.style.color = '#ffffff';
      
      // Apply high contrast to all elements immediately
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        // Only change text color, not background (to avoid breaking layouts)
        if (htmlElement.tagName !== 'HTML' && htmlElement.tagName !== 'BODY') {
          htmlElement.style.color = '#ffffff';
          htmlElement.style.borderColor = '#ffffff';
        }
      });
      
      console.log(`High contrast mode enabled immediately on ${allElements.length} elements`);
    } else {
      // Disable high contrast mode
      root.classList.remove('high-contrast');
      body.classList.remove('high-contrast');
      
      // Reset CSS variables to default
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
      root.style.removeProperty('--border');
      
      // Reset body styles
      body.style.backgroundColor = '';
      body.style.color = '';
      
      // Reset styles on all elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.tagName !== 'HTML' && htmlElement.tagName !== 'BODY') {
          htmlElement.style.color = '';
          htmlElement.style.borderColor = '';
        }
      });
      
      console.log(`High contrast mode disabled immediately on ${allElements.length} elements`);
    }
  };

  const handleDyslexiaFontToggle = (checked: boolean) => {
    setDyslexiaFont(checked);
    updateSetting('dyslexiaFont', checked);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newFontSize = value[0];
    setFontSize(value);
    updateSetting('fontSize', newFontSize);
    
    // Apply font size immediately
    const root = document.documentElement;
    root.style.setProperty('--accessible-font-size', `${newFontSize}px`);
    document.body.style.fontSize = `${newFontSize}px`;
    document.body.classList.add('dynamic-font-size');
    
    // Apply font size to all text elements immediately
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea, label, a');
    textElements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${newFontSize}px`;
    });
    
    // Also apply to the root element
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${newFontSize}px`;
    });
    
    console.log(`Font size immediately set to: ${newFontSize}px on ${textElements.length} text elements and ${allElements.length} total elements`);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    updateSetting('language', lang);
  };

  const maLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ht", name: "Kreyòl Ayisyen", flag: "🇭🇹" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "cv", name: "Kabuverdianu", flag: "🇨🇻" },
  ];

  const accessibilityFeatures = [
    {
      icon: MessageSquare,
      title: "ASL Interpretation",
      description: "Request ASL interpreters for MA public meetings via MCDHH integration",
      status: "Available",
      color: "secondary"
    },
    {
      icon: Eye,
      title: "Screen Reader Optimized",
      description: "WCAG 2.1 AA compliant with enhanced screen reader support",
      status: "Compliant",
      color: "accent"
    },
    {
      icon: Type,
      title: "Dyslexia-Friendly Mode",
      description: "OpenDyslexic font and enhanced readability features",
      status: "Available",
      color: "primary"
    },
    {
      icon: Palette,
      title: "High Contrast Mode",
      description: "Enhanced contrast ratios (≥4.5:1) for better visibility",
      status: highContrast ? "Active" : "Available",
      color: "secondary"
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Real-time translation for MA priority languages",
      status: "Active",
      color: "accent"
    }
  ];

  const requestASLSupport = () => {
    // Open MCDHH Interpreter & CART Referral Service
    window.open("https://www.mass.gov/service-details/interpreter-cart-referral-service", "_blank");
  };

  return (
    <div className={`min-h-screen bg-background ${settings.dyslexiaFont ? 'dyslexia-font' : ''} accessible-text`}>
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
                <Accessibility className="w-4 h-4 mr-2" />
                WCAG 2.1 AA Compliant
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Universal Access to
                <span className="block text-primary">Civic Participation</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Every feature designed to ensure no one is left behind in Massachusetts democracy. 
                Compliant with state digital accessibility standards.
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Controls */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Customize Your Experience
              </h2>
              
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Accessibility Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Palette className="w-5 h-5 text-primary" />
                      <div>
                        <label className="font-medium text-foreground">High Contrast Mode</label>
                        <p className="text-sm text-muted-foreground">Enhanced visibility (≥4.5:1 ratio)</p>
                      </div>
                    </div>
                    <Switch
                      checked={highContrast}
                      onCheckedChange={handleHighContrastToggle}
                    />
                  </div>

                  {/* Dyslexia Font */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Type className="w-5 h-5 text-primary" />
                      <div>
                        <label className="font-medium text-foreground">Dyslexia-Friendly Font</label>
                        <p className="text-sm text-muted-foreground">OpenDyslexic font for easier reading</p>
                      </div>
                    </div>
                    <Switch
                      checked={dyslexiaFont}
                      onCheckedChange={handleDyslexiaFontToggle}
                    />
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Type className="w-5 h-5 text-primary" />
                      <label className="font-medium text-foreground">Font Size: {fontSize[0]}px</label>
                    </div>
                    <Slider
                      value={fontSize}
                      onValueChange={handleFontSizeChange}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Languages className="w-5 h-5 text-primary" />
                      <label className="font-medium text-foreground">Priority Languages (MA)</label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {maLanguages.map((lang) => (
                        <Button
                          key={lang.code}
                          variant={language === lang.code ? "civic" : "outline"}
                          size="sm"
                          onClick={() => handleLanguageChange(lang.code)}
                          className="justify-start"
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
                Accessibility Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessibilityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-civic transition-accessible">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`
                            flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                            ${feature.color === 'primary' ? 'gradient-civic' : ''}
                            ${feature.color === 'secondary' ? 'gradient-community' : ''}
                            ${feature.color === 'accent' ? 'gradient-impact' : ''}
                          `}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-foreground">{feature.title}</h3>
                              <Badge 
                                variant="secondary"
                                className="text-xs bg-secondary/10 text-secondary"
                              >
                                {feature.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ASL Support Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full gradient-community flex items-center justify-center mx-auto mb-6">
                      <Headphones className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Need ASL or CART Services?
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      Request professional interpreters for Massachusetts public meetings through 
                      the official MCDHH referral service.
                    </p>
                    <Button 
                      onClick={requestASLSupport}
                      variant="community" 
                      size="lg"
                      className="mr-4"
                    >
                      Request Interpreter
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                    <Link to="/asl-services">
                      <Button variant="outline" size="lg">
                        Learn More
                        <MessageSquare className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 Local Lens. Committed to universal accessibility and WCAG 2.1 AA compliance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AccessibilityPage;