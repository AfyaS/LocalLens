import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Languages, 
  Volume2, 
  Eye, 
  Users, 
  BarChart3, 
  MapPin, 
  MessageSquare,
  Accessibility,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "AI Translation & Simplification",
    description: "Converts complex legal documents and government notices into clear, simple language with support for 50+ languages.",
    badge: "AI-Powered",
    color: "primary"
  },
  {
    icon: Accessibility,
    title: "Universal Accessibility",
    description: "ASL avatars, dyslexia-friendly fonts, and adaptive contrast for everyone's needs.",
    badge: "WCAG Compliant",
    color: "secondary"
  },
  {
    icon: Users,
    title: "Community Action Hub",
    description: "Find local initiatives, volunteer opportunities, and civic events tailored to your interests and location.",
    badge: "Location-Based",
    color: "accent"
  },
  {
    icon: BarChart3,
    title: "Impact Tracking",
    description: "Gamified dashboard showing how your civic actions create real change in your community.",
    badge: "Data-Driven",
    color: "primary"
  },
  {
    icon: MessageSquare,
    title: "Direct Representative Access",
    description: "Connect with local representatives, track voting records, and get personalized policy updates.",
    badge: "Real-Time",
    color: "secondary"
  },
  {
    icon: Shield,
    title: "Privacy-First Design",
    description: "Your data stays secure with end-to-end encryption and transparent privacy controls.",
    badge: "Secure",
    color: "accent"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Breaking Down Barriers to
            <br />
            <span className="text-primary">Civic Participation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is designed with accessibility and inclusion at its core, ensuring no one is left behind in the democratic process.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-soft hover:shadow-civic transition-accessible group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                      ${feature.color === 'primary' ? 'gradient-civic' : ''}
                      ${feature.color === 'secondary' ? 'gradient-community' : ''}
                      ${feature.color === 'accent' ? 'gradient-impact' : ''}
                      transition-accessible group-hover:scale-110
                    `}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-muted text-muted-foreground"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-accessible">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft border">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-secondary/20 text-secondary">
                <Eye className="w-4 h-4 mr-2" />
                See It In Action
              </Badge>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Experience AI-Powered Accessibility
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Watch how our AI transforms a complex city ordinance into simple, accessible language that everyone can understand.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Real-time translation and simplification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Audio playback with natural voice</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Visual accessibility adaptations</span>
                </div>
              </div>
              <Button variant="community" size="lg">
                Try Interactive Demo
                <Volume2 className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-6 border-2 border-dashed border-border">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Interactive Demo Coming Soon</p>
                <p className="text-sm">Experience live AI translation of government documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;