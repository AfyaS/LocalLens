import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Volume2, Languages, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-civic-engagement.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Diverse community members engaging with accessible civic technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/70 to-secondary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 text-sm font-medium bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Users className="w-4 h-4 mr-2" />
            Powered by AI • Built for Everyone
          </Badge>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Voice in
            <span className="block gradient-impact bg-clip-text text-transparent">
              Local Government
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            AI-powered accessibility meets civic engagement. Breaking down barriers so every voice can shape their community.
          </p>

          {/* Key features */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center text-white/90 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Languages className="w-5 h-5 mr-2 text-accent" />
              <span className="font-medium">AI Translation</span>
            </div>
            <div className="flex items-center text-white/90 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Volume2 className="w-5 h-5 mr-2 text-accent" />
              <span className="font-medium">Audio Support</span>
            </div>
            <div className="flex items-center text-white/90 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <BarChart3 className="w-5 h-5 mr-2 text-accent" />
              <span className="font-medium">Impact Tracking</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/get-started">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto"
                aria-label="Start exploring Local Lens features"
              >
                Start Your Civic Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/accessibility">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                aria-label="Learn more about accessibility features"
              >
                See Accessibility Features
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4">Trusted by communities across the nation</p>
            <div className="flex items-center space-x-8 text-white/80">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Accessibility<br />Compliant</div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Languages<br />Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;