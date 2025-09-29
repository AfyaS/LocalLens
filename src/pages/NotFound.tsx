import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  MapPin, 
  Users, 
  FileText,
  AlertCircle,
  Lightbulb,
  Heart
} from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-secondary/5 to-accent/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* 404 Illustration */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
                  <div className="absolute -top-2 -right-2">
                    <AlertCircle className="w-12 h-12 text-accent animate-pulse" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Page Not Found
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Oops! The page you're looking for seems to have wandered off. 
                Don't worry, we'll help you find your way back to civic engagement.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/community">
                    <Users className="w-4 h-4 mr-2" />
                    Explore Community
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Helpful Links Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Popular Destinations
                </h2>
                <p className="text-muted-foreground">
                  Here are some pages you might be looking for
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Community Page */}
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg mr-4">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Community</h3>
                        <p className="text-sm text-muted-foreground">Events & Opportunities</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Discover local civic engagement opportunities, volunteer positions, and community events.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/community">
                        <MapPin className="w-4 h-4 mr-2" />
                        Explore Community
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Accessibility Page */}
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-accent/10 rounded-lg mr-4">
                        <FileText className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Accessibility</h3>
                        <p className="text-sm text-muted-foreground">Inclusive Design</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Learn about our commitment to accessibility and inclusive civic engagement.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/accessibility">
                        <Heart className="w-4 h-4 mr-2" />
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Search Page */}
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-secondary/10 rounded-lg mr-4">
                        <Search className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Search</h3>
                        <p className="text-sm text-muted-foreground">Find What You Need</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Use our search feature to find specific opportunities or information.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/community">
                        <Search className="w-4 h-4 mr-2" />
                        Start Searching
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <Lightbulb className="w-16 h-16 text-accent mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Need Help?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  If you're still having trouble finding what you need, we're here to help.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Reach out to our support team for personalized assistance.
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-accent/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Report Issue</h3>
                    <p className="text-muted-foreground mb-4">
                      Help us improve by reporting this broken link or page.
                    </p>
                    <Button variant="outline" size="sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2025 LocalLens. Building accessible civic engagement for all.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;