import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  User, 
  Bell, 
  Target, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Volume2,
  Eye,
  Languages,
  Accessibility
} from "lucide-react";

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    location: "",
    interests: [] as string[],
    accessibility: [] as string[]
  });

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Local Lens",
      subtitle: "Your civic engagement journey starts here",
      icon: Target
    },
    {
      id: "location",
      title: "Where are you located?",
      subtitle: "We'll show you relevant local government information",
      icon: MapPin
    },
    {
      id: "interests",
      title: "What matters to you?",
      subtitle: "Select civic areas you want to stay informed about",
      icon: Bell
    },
    {
      id: "accessibility",
      title: "Accessibility preferences",
      subtitle: "Customize your experience for better access",
      icon: Accessibility
    },
    {
      id: "complete",
      title: "You're all set!",
      subtitle: "Start exploring Massachusetts civic opportunities",
      icon: CheckCircle
    }
  ];

  const civicInterests = [
    "Local Government", "Education", "Environment", "Public Safety",
    "Transportation", "Housing", "Healthcare", "Budget & Taxes"
  ];

  const accessibilityOptions = [
    { id: "screen-reader", label: "Screen Reader Support", icon: Eye },
    { id: "high-contrast", label: "High Contrast Mode", icon: Eye },
    { id: "translation", label: "Language Translation", icon: Languages }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user data when completing setup
      await saveUserPreferences();
    }
  };

  const saveUserPreferences = async () => {
    // For now, just store in localStorage
    // In a real app, you'd save to the database
    localStorage.setItem('userOnboardingData', JSON.stringify(userData));
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleAccessibility = (option: string) => {
    setUserData(prev => ({
      ...prev,
      accessibility: prev.accessibility.includes(option)
        ? prev.accessibility.filter(a => a !== option)
        : [...prev.accessibility, option]
    }));
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-civic flex items-center justify-center mx-auto mb-4">
                <CurrentIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {steps[currentStep].subtitle}
              </p>
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="p-8">
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                      Engage with Massachusetts Democracy
                    </h2>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Stay informed about local legislation</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Find community volunteer opportunities</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Connect with your representatives</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Track your civic impact</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Enter your Massachusetts address or ZIP code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Boston, MA or 02101"
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={userData.location}
                        onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        We use your location to show you relevant local government information,
                        meeting schedules, and representatives for your district.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-foreground mb-4">
                        Select your civic interests
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {civicInterests.map((interest) => (
                          <Button
                            key={interest}
                            variant={userData.interests.includes(interest) ? "civic" : "outline"}
                            onClick={() => toggleInterest(interest)}
                            className="justify-start h-auto p-3"
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        We'll prioritize notifications and content based on your selected interests.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-foreground mb-4">
                        Choose accessibility features
                      </h3>
                      <div className="space-y-3">
                        {accessibilityOptions.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <Button
                              key={option.id}
                              variant={userData.accessibility.includes(option.id) ? "civic" : "outline"}
                              onClick={() => toggleAccessibility(option.id)}
                              className="w-full justify-start h-auto p-4"
                            >
                              <OptionIcon className="w-5 h-5 mr-3" />
                              {option.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        All features comply with WCAG 2.1 AA standards and Massachusetts
                        digital accessibility requirements.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full gradient-civic flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Welcome to Local Lens!
                    </h2>
                    <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{userData.location || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interests:</span>
                        <span className="font-medium">{userData.interests.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accessibility:</span>
                        <span className="font-medium">{userData.accessibility.length} enabled</span>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Button variant="civic" size="lg" className="w-full">
                        Explore Your Dashboard
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        View Accessibility Features
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  variant="civic"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !userData.location) ||
                    (currentStep === 2 && userData.interests.length === 0)
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="civic">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;