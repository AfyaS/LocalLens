import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  MessageSquare, 
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  FileText,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

const ASLServicesPage = () => {
  const [activeTab, setActiveTab] = useState("interpreter");

  const services = [
    {
      title: "ASL Interpretation",
      description: "Professional American Sign Language interpreters for meetings, events, and appointments",
      icon: MessageSquare,
      availability: "24-48 hours notice preferred",
      cost: "Free for public meetings"
    },
    {
      title: "CART Services",
      description: "Communication Access Realtime Translation for live captioning",
      icon: FileText,
      availability: "48-72 hours notice required",
      cost: "Free for qualifying events"
    },
    {
      title: "Video Remote Interpreting",
      description: "Remote ASL interpretation via video technology",
      icon: Headphones,
      availability: "Same day available",
      cost: "Varies by provider"
    }
  ];

  const requestTypes = [
    {
      type: "Town Hall Meetings",
      requirements: "Submit request 5 business days prior",
      covered: true
    },
    {
      type: "City Council Sessions",
      requirements: "Contact clerk's office directly",
      covered: true
    },
    {
      type: "Public Hearings",
      requirements: "Request through hosting department",
      covered: true
    },
    {
      type: "Community Forums",
      requirements: "Depends on organizing entity",
      covered: "varies"
    },
    {
      type: "Educational Workshops",
      requirements: "Must be government-sponsored",
      covered: true
    }
  ];

  const requestASLSupport = () => {
    window.open("https://www.mass.gov/service-details/interpreter-cart-referral-service", "_blank");
  };

  const contactMCDHH = () => {
    window.open("https://www.mass.gov/orgs/massachusetts-commission-for-the-deaf-and-hard-of-hearing", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-secondary/10 to-accent/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/accessibility" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Accessibility
              </Link>
              
              <div className="text-center">
                <Badge variant="outline" className="mb-6 border-secondary/20 text-secondary">
                  <Headphones className="w-4 h-4 mr-2" />
                  Massachusetts MCDHH Services
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  ASL & CART Services
                  <span className="block text-secondary">for Public Participation</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Free professional interpretation and captioning services to ensure equal access 
                  to Massachusetts government meetings and civic activities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
                Available Services
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-community flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-2" />
                                {service.availability}
                              </div>
                              <div className="flex items-center text-xs text-secondary">
                                <CheckCircle className="w-3 h-3 mr-2" />
                                {service.cost}
                              </div>
                            </div>
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

        {/* Request Coverage */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                What's Covered?
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Public Meeting Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requestTypes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.type}</h4>
                          <p className="text-sm text-muted-foreground">{item.requirements}</p>
                        </div>
                        <div className="flex items-center">
                          {item.covered === true ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Covered
                            </Badge>
                          ) : item.covered === "varies" ? (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Varies
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Not Covered
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Request */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                How to Request Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Online Request Form
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Use the official MCDHH request form for fastest processing.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Available 24/7
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Automatic confirmation email
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Track request status
                      </div>
                    </div>
                    <Button onClick={requestASLSupport} className="w-full" variant="community">
                      Submit Request Form
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Phone className="w-5 h-5 mr-2 text-primary" />
                      Direct Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Speak directly with MCDHH staff for complex requests.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">Voice: (617) 740-1600</div>
                          <div className="text-muted-foreground">TTY: (617) 740-1700</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-3 text-primary" />
                        <div>
                          <div className="font-medium">mcdhh@mass.gov</div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Office Hours</div>
                          <div className="text-muted-foreground">Mon-Fri: 8:30 AM - 5:00 PM</div>
                        </div>
                      </div>
                    </div>
                    <Button onClick={contactMCDHH} variant="outline" className="w-full">
                      Visit MCDHH Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-yellow-900 mb-4">
                        Important Guidelines
                      </h3>
                      <div className="space-y-3 text-yellow-800">
                        <p className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          Request services at least 5 business days in advance when possible
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          Services are provided free of charge for qualifying public meetings
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          Last-minute requests will be accommodated when interpreters are available
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium mr-2">•</span>
                          Contact the hosting agency directly for some municipal meetings
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Ready to Request Services?
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={requestASLSupport}
                  size="lg" 
                  variant="community"
                  className="min-w-[200px]"
                >
                  Request Interpreter
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={contactMCDHH}
                  size="lg" 
                  variant="outline"
                  className="min-w-[200px]"
                >
                  Contact MCDHH
                  <Phone className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Massachusetts Commission for the Deaf and Hard of Hearing • Ensuring Equal Access Since 1971
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ASLServicesPage;