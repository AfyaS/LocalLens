import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 Local Lens. Built with accessibility and civic engagement in mind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;