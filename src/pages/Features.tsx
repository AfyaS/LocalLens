import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Building, 
  MessageSquare, 
  Eye, 
  Languages, 
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Shield,
  Zap,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  X
} from "lucide-react";

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState("overview");

  // Detailed content for Learn More modals
  const getFeatureDetails = (title: string) => {
    switch (title) {
      case "Universal Access":
        return {
          title: "Universal Access",
          description: "Our platform is designed with accessibility at its core, ensuring everyone can participate in democracy regardless of their abilities or language preferences.",
          features: [
            "Screen reader compatibility for visually impaired users",
            "High contrast mode and customizable text sizes",
            "Keyboard navigation support for motor disabilities",
            "Multi-language support with real-time translation",
            "ASL video integration for deaf and hard-of-hearing users",
            "Simplified language options for complex government documents"
          ],
          icon: Globe,
          color: "primary"
        };
      case "Real-Time Updates":
        return {
          title: "Real-Time Updates",
          description: "Stay informed with live data from government sources and community organizations, ensuring you never miss important civic opportunities.",
          features: [
            "Live government meeting schedules and agendas",
            "Real-time voting records and legislative updates",
            "Instant notifications for new civic opportunities",
            "Live streaming of public meetings and hearings",
            "Automated updates from community organizations",
            "Real-time collaboration on civic projects",
            "Live chat and discussion forums"
          ],
          icon: Zap,
          color: "secondary"
        };
      case "AI-Powered":
        return {
          title: "AI-Powered Features",
          description: "Leverage artificial intelligence to make civic engagement more effective and personalized to your interests and needs.",
          features: [
            "Smart matching of civic opportunities to your interests",
            "AI-powered language translation for multilingual support",
            "Intelligent summarization of complex government documents",
            "Personalized recommendations for civic actions",
            "Automated accessibility features and accommodations",
            "AI chatbot for civic engagement guidance",
            "Predictive analytics for community impact"
          ],
          icon: Star,
          color: "accent"
        };
      default:
        return null;
    }
  };

  const features = [
    {
      id: "overview",
      title: "Platform Overview",
      description: "Comprehensive civic engagement platform",
      icon: Building,
      color: "primary"
    },
    {
      id: "accessibility",
      title: "Accessibility Features",
      description: "Universal design for all users",
      icon: Eye,
      color: "secondary"
    },
    {
      id: "community",
      title: "Community Tools",
      description: "Connect and engage with your community",
      icon: Users,
      color: "accent"
    },
    {
      id: "government",
      title: "Government Integration",
      description: "Direct access to government services",
      icon: Shield,
      color: "primary"
    }
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
      icon: Languages,
      title: "Multi-Language Support",
      description: "50+ languages including priority MA languages",
      status: "Active",
      color: "primary"
    },
    {
      icon: Heart,
      title: "Dyslexia-Friendly Fonts",
      description: "OpenDyslexic font support for better readability",
      status: "Enabled",
      color: "secondary"
    }
  ];

  const communityFeatures = [
    {
      icon: Calendar,
      title: "Public Meeting Calendar",
      description: "Real-time updates on government meetings and hearings",
      status: "Live",
      color: "primary"
    },
    {
      icon: Users,
      title: "Volunteer Opportunities",
      description: "Find and join community service opportunities",
      status: "Active",
      color: "secondary"
    },
    {
      icon: MapPin,
      title: "Local Representatives",
      description: "Contact information for your elected officials",
      status: "Updated",
      color: "accent"
    },
    {
      icon: BarChart3,
      title: "Community Impact",
      description: "Track your civic engagement and community impact",
      status: "Analytics",
      color: "primary"
    }
  ];

  const governmentFeatures = [
    {
      icon: Building,
      title: "MA Legislature Integration",
      description: "Direct access to Massachusetts Legislature hearings and bills",
      status: "Live",
      color: "primary"
    },
    {
      icon: FileText,
      title: "Document Access",
      description: "Access government documents and meeting materials",
      status: "Available",
      color: "secondary"
    },
    {
      icon: Phone,
      title: "Direct Contact",
      description: "Contact representatives via phone, email, or online forms",
      status: "Connected",
      color: "accent"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Meets all government security and accessibility standards",
      status: "Certified",
      color: "primary"
    }
  ];

  const getFeatureContent = () => {
    switch (activeFeature) {
      case "accessibility":
        return accessibilityFeatures;
      case "community":
        return communityFeatures;
      case "government":
        return governmentFeatures;
      default:
        return [
          {
            icon: Globe,
            title: "Universal Access",
            description: "Designed for everyone, regardless of ability or language",
            status: "Core",
            color: "primary"
          },
          {
            icon: Zap,
            title: "Real-Time Updates",
            description: "Live data from government sources and community organizations",
            status: "Live",
            color: "secondary"
          },
          {
            icon: Star,
            title: "AI-Powered",
            description: "Intelligent features to help you engage more effectively",
            status: "AI",
            color: "accent"
          }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Platform Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comprehensive Civic Engagement
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to participate in democracy, accessible to everyone
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant={activeFeature === feature.id ? "community" : "outline"}
                  size="lg"
                  onClick={() => setActiveFeature(feature.id)}
                  className="flex items-center space-x-3"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{feature.title}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {features.find(f => f.id === activeFeature)?.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {features.find(f => f.id === activeFeature)?.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeatureContent().map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-community transition-accessible">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${feature.color}`} />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-${feature.color}/10 flex items-center justify-center`}>
                                <IconComponent className={`w-5 h-5 text-${feature.color}`} />
                              </div>
                              {feature.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {(() => {
                              const details = getFeatureDetails(feature.title);
                              if (!details) return null;
                              return (
                                <>
                                  <p className="text-muted-foreground">
                                    {details.description}
                                  </p>
                                  <div className="space-y-3">
                                    <h4 className="font-semibold">Key Features:</h4>
                                    <ul className="space-y-2">
                                      {details.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                          <span className="text-sm">{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Use Local Lens to participate in democracy and create change in your community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="community" 
                size="lg"
                onClick={() => window.location.href = '/community'}
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/community'}
              >
                <FileText className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 LocalLens. Committed to universal accessibility and civic engagement.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
