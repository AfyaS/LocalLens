import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-accent/20 text-accent">
            <Sparkles className="w-4 h-4 mr-2" />
            Join the Movement
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Make Your
            <span className="block text-primary">Voice Heard?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create meaningful change in your community with Local Lens.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/get-started">
              <Button variant="hero" size="lg" className="px-8 py-4 h-auto text-lg">
                Start Your Impact Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/accessibility">
              <Button variant="outline" size="lg" className="px-8 py-4 h-auto text-lg">
                See Accessibility Features
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
                <div className="w-6 h-6 rounded-full bg-secondary"></div>
                <div className="w-6 h-6 rounded-full bg-accent"></div>
                <div className="w-6 h-6 rounded-full bg-primary-light"></div>
              </div>
              <span>Join our community</span>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <Card className="max-w-2xl mx-auto shadow-civic border-0">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 gradient-community rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Stay Connected
              </h3>
              <p className="text-muted-foreground">
                Get early access updates and civic engagement tips delivered to your inbox.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                aria-label="Email address for newsletter"
              />
              <Button variant="community" className="px-6">
                Notify Me
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 gradient-civic rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Community First</h4>
            <p className="text-sm text-muted-foreground">
              Every feature designed to strengthen community bonds and civic participation.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 gradient-community rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Accessibility Always</h4>
            <p className="text-sm text-muted-foreground">
              Inclusive design ensures everyone can participate in democracy.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 gradient-impact rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Real Impact</h4>
            <p className="text-sm text-muted-foreground">
              Track and measure how your civic actions create tangible change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;