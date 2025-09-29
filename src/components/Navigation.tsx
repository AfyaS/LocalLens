import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Accessibility, Users, BarChart3, Languages, LogOut, User, Bell } from "lucide-react";
import CustomLogo from "./CustomLogo";
import { useAuth } from "@/contexts/AuthContext";
import NotificationSystem from "./NotificationSystem";
import { useAccessibility } from "@/hooks/useAccessibility";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, signOut } = useAuth();
  const { settings } = useAccessibility();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { href: "/features", label: "Features", icon: Languages },
    { href: "/accessibility", label: "Accessibility", icon: Accessibility },
    { href: "/community", label: "Community", icon: Users },
    { href: "/impact", label: "Impact", icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg gradient-civic flex items-center justify-center">
              <CustomLogo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Local Lens</h1>
              <Badge variant="secondary" className="text-xs bg-secondary/10 text-secondary border-0">
                Civic + AI
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-accessible"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-accessible"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Language Indicator */}
            {settings.language !== 'en' && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Languages className="w-4 h-4" />
                <span className="capitalize">
                  {settings.language === 'es' ? 'Español' :
                   settings.language === 'pt' ? 'Português' :
                   settings.language === 'zh' ? '中文' :
                   settings.language === 'ht' ? 'Kreyòl' :
                   'English'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="civic">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/get-started">
                  <Button variant="civic" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return item.href.startsWith('#') ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-accessible"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-accessible"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="civic" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/sign-in">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/get-started">
                      <Button variant="civic" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <NotificationSystem 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
};

export default Navigation;