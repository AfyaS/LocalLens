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
  X,
  GraduationCap,
  BookOpen,
  Gamepad2,
  Paintbrush,
  Music,
  Camera,
  Video,
  Lightbulb,
  Trophy,
  Smile
} from "lucide-react";

const KidsPage = () => {
  const [activeFeature, setActiveFeature] = useState("overview");

  // Detailed content for Learn More modals
  const getFeatureDetails = (title: string) => {
    switch (title) {
      case "Civic Learning":
        return {
          title: "Civic Learning",
          description: "Fun and interactive ways for kids to learn about democracy, government, and how to make a difference in their community.",
          features: [
            "Interactive games about local government",
            "Kid-friendly explanations of how laws are made",
            "Virtual tours of government buildings",
            "Meet your local representatives (kid-friendly format)",
            "Learn about voting and elections through games",
            "Discover how kids can make a difference in their community"
          ],
          icon: GraduationCap,
          color: "primary"
        };
      case "Creative Expression":
        return {
          title: "Creative Expression",
          description: "Express your ideas and concerns through art, music, writing, and other creative activities that can influence your community.",
          features: [
            "Art contests for community issues",
            "Music and video creation tools",
            "Writing prompts about civic topics",
            "Digital storytelling about your neighborhood",
            "Photo essays about community life",
            "Collaborative art projects with other kids"
          ],
          icon: Paintbrush,
          color: "secondary"
        };
      case "Safe Community":
        return {
          title: "Safe Community",
          description: "A safe, moderated space where kids can learn about civic engagement with proper supervision and age-appropriate content.",
          features: [
            "Parent/guardian approval required for participation",
            "Moderated discussions and content",
            "Age-appropriate civic education materials",
            "Safe reporting system for any concerns",
            "Educational resources for parents and teachers",
            "Privacy protection for all young users"
          ],
          icon: Shield,
          color: "accent"
        };
      default:
        return null;
    }
  };

  const features = [
    {
      id: "overview",
      title: "Kids Overview",
      description: "Civic engagement made fun for young citizens",
      icon: GraduationCap,
      color: "primary"
    },
    {
      id: "learning",
      title: "Learning Tools",
      description: "Interactive civic education for young minds",
      icon: BookOpen,
      color: "secondary"
    },
    {
      id: "creative",
      title: "Creative Expression",
      description: "Express ideas through art and creativity",
      icon: Paintbrush,
      color: "accent"
    },
    {
      id: "safety",
      title: "Safe Environment",
      description: "Protected space for young civic engagement",
      icon: Shield,
      color: "primary"
    }
  ];

  const learningFeatures = [
    {
      icon: Gamepad2,
      title: "Civic Games",
      description: "Play fun games to learn about local government and democracy",
      status: "Available",
      color: "secondary"
    },
    {
      icon: Building,
      title: "Virtual Tours",
      description: "Take virtual tours of government buildings and learn how they work",
      status: "Live",
      color: "accent"
    },
    {
      icon: Users,
      title: "Meet Representatives",
      description: "Kid-friendly meetings with local officials and community leaders",
      status: "Scheduled",
      color: "primary"
    },
    {
      icon: Trophy,
      title: "Achievement Badges",
      description: "Earn badges for learning about civic engagement and community service",
      status: "Active",
      color: "secondary"
    }
  ];

  const creativeFeatures = [
    {
      icon: Paintbrush,
      title: "Art Contests",
      description: "Create art about community issues and share your vision",
      status: "Ongoing",
      color: "primary"
    },
    {
      icon: Music,
      title: "Music Creation",
      description: "Write songs and create music about your community",
      status: "Available",
      color: "secondary"
    },
    {
      icon: Camera,
      title: "Photo Stories",
      description: "Tell stories about your neighborhood through photography",
      status: "Active",
      color: "accent"
    },
    {
      icon: Video,
      title: "Video Projects",
      description: "Create videos about issues that matter to you and your friends",
      status: "Coming Soon",
      color: "primary"
    }
  ];

  const safetyFeatures = [
    {
      icon: Shield,
      title: "Parent Approval",
      description: "All activities require parent or guardian permission",
      status: "Required",
      color: "primary"
    },
    {
      icon: Eye,
      title: "Content Moderation",
      description: "All content is reviewed by adults to ensure it's safe and appropriate",
      status: "Active",
      color: "secondary"
    },
    {
      icon: Heart,
      title: "Age-Appropriate",
      description: "All materials are designed specifically for young people",
      status: "Verified",
      color: "accent"
    },
    {
      icon: Smile,
      title: "Positive Environment",
      description: "Focus on learning, creativity, and positive community engagement",
      status: "Maintained",
      color: "primary"
    }
  ];

  const getFeatureContent = () => {
    switch (activeFeature) {
      case "learning":
        return learningFeatures;
      case "creative":
        return creativeFeatures;
      case "safety":
        return safetyFeatures;
      default:
        return [
          {
            icon: GraduationCap,
            title: "Civic Learning",
            description: "Learn about democracy and government in fun, interactive ways",
            status: "Educational",
            color: "primary"
          },
          {
            icon: Paintbrush,
            title: "Creative Expression",
            description: "Express your ideas through art, music, and creative projects",
            status: "Creative",
            color: "secondary"
          },
          {
            icon: Shield,
            title: "Safe Community",
            description: "A protected space designed specifically for young civic engagement",
            status: "Safe",
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
              For Young Citizens
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Kids Civic Engagement
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn about democracy, express your ideas, and make a difference in your community - all in a safe, fun environment!
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
                                    <h4 className="font-semibold">What You Can Do:</h4>
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

      {/* Educational Videos Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Educational Videos
              </h2>
              <p className="text-lg text-muted-foreground">
                Watch these fun and educational videos to learn about civic engagement and community involvement!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Video 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/jqweYnRRs1Q"
                      title="Civic Engagement Video 1"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Video 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/7GguzhUVUek"
                      title="Civic Engagement Video 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Video 3 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/FWwEMFSY1r0"
                      title="Civic Engagement Video 3"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Video 4 */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/mUY0vEL-KE4"
                      title="Civic Engagement Video 4"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Special Kids Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Smile className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Made Just for Kids!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Everything is designed to be fun, safe, and educational. Learn about your community while having a great time!
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Learn & Discover</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover how your community works through games and interactive activities
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Express Yourself</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your ideas and creativity through art, music, and storytelling
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Make a Difference</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how even kids can help make their community a better place
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="community" 
                size="lg"
                onClick={() => window.location.href = '/get-started'}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Get Started (with Parent Permission)
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/community'}
              >
                <Users className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 LocalLens. Safe, fun civic engagement for young citizens.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KidsPage;
