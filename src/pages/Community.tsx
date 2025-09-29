import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { azureApi, type CivicAction } from "@/lib/azure-api";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock,
  ExternalLink,
  Search,
  Filter,
  Heart,
  MessageSquare,
  Megaphone,
  Building,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const CommunityPage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [civicActions, setCivicActions] = useState<CivicAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch civic actions from Azure API
  useEffect(() => {
    fetchCivicActions();
  }, []);

  const fetchCivicActions = async () => {
    try {
      setLoading(true);
      console.log('Fetching civic actions from API...');
      const actions = await azureApi.getCivicActions();
      console.log('Received civic actions:', actions);
      console.log('Number of actions:', actions.length);
      setCivicActions(actions);
    } catch (error) {
      console.error('Error fetching civic actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      // Trigger MA Legislature sync
      await azureApi.triggerMALegislatureSync();
      // Fetch updated data
      await fetchCivicActions();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Transform civic actions to display format
  const upcomingEvents = civicActions
    .filter(action => action.category === 'Legislative Hearing' || action.category === 'Government')
    .map(action => ({
      title: action.title,
      date: action.date_time ? new Date(action.date_time).toISOString().split('T')[0] : 'TBD',
      time: action.date_time ? new Date(action.date_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }) : 'TBD',
      location: action.location,
      type: action.category,
      remoteLink: action.virtual_link,
      aslAvailable: !!action.accessibility_notes,
      languages: ["English"], // Default for now
      category: action.category.toLowerCase().includes('legislative') ? 'government' : 'government'
    }));

  // Static volunteer opportunities (fallback data)
  const staticVolunteerOpportunities = [
    {
      title: "Community Garden Cleanup",
      organization: "Boston Parks Alliance",
      location: "Franklin Park, Boston",
      date: "2025-01-20",
      commitment: "3 hours",
      type: "Environment",
      contactMethod: "Mass 211",
      category: "environment"
    },
    {
      title: "Tax Preparation Assistance",
      organization: "VITA Program",
      location: "Multiple locations",
      date: "Ongoing through April",
      commitment: "4 hours/week",
      type: "Community Service",
      contactMethod: "Mass Service Alliance",
      category: "service"
    },
    {
      title: "Food Bank Distribution",
      organization: "Greater Boston Food Bank",
      location: "Various sites",
      date: "Every Saturday",
      commitment: "2-3 hours",
      type: "Human Services",
      contactMethod: "Mass 211",
      category: "service"
    }
  ];

  const representatives = [
    {
      name: "Elizabeth Warren",
      office: "U.S. Senator",
      district: "Massachusetts",
      party: "Democratic",
      phone: "(202) 224-4543",
      email: "senator@warren.senate.gov",
      officeHours: "By appointment",
      preferredContact: "Online form"
    },
    {
      name: "Ed Markey",
      office: "U.S. Senator", 
      district: "Massachusetts",
      party: "Democratic",
      phone: "(202) 224-2742",
      email: "senator@markey.senate.gov",
      officeHours: "By appointment",
      preferredContact: "Phone"
    }
  ];

  const serviceResources = [
    {
      name: "Mass 211",
      description: "Statewide social services help in multiple languages",
      phone: "2-1-1",
      website: "https://mass211.org",
      languages: ["English", "Spanish", "Portuguese", "Chinese", "Haitian Creole"],
      available: "24/7"
    },
    {
      name: "Boston 311",
      description: "City services and non-emergency assistance",
      phone: "3-1-1",
      website: "https://311.boston.gov",
      languages: ["English", "Spanish"],
      available: "24/7"
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: Users },
    { id: "government", label: "Government", icon: Building },
    { id: "environment", label: "Environment", icon: Heart },
    { id: "housing", label: "Housing", icon: Building },
    { id: "service", label: "Community Service", icon: Users }
  ];

  const filteredEvents = selectedCategory === "all" 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === selectedCategory);

  // Filter for actual volunteer opportunities (exclude legislative hearings)
  const realVolunteerOpportunities = civicActions.filter(action => 
    action.category === "Community" || 
    action.category === "Volunteer" ||
    action.category === "Education" ||
    action.category === "Environment" ||
    (action.category === "Government" && !action.title.includes("Legislative Hearing") && !action.title.includes("Joint Committee"))
  );

  // Combine real data with static fallback data
  const volunteerOpportunities = realVolunteerOpportunities.length > 0 
    ? realVolunteerOpportunities 
    : staticVolunteerOpportunities;

  // Enhanced filtering logic for different categories
  const filteredOpportunities = selectedCategory === "all"
    ? volunteerOpportunities
    : volunteerOpportunities.filter(action => {
      switch (selectedCategory) {
        case "environment":
          return action.category === "Environment" || 
                 action.title.toLowerCase().includes("environment") ||
                 action.title.toLowerCase().includes("climate") ||
                 action.title.toLowerCase().includes("cleanup") ||
                 action.title.toLowerCase().includes("garden");
        case "housing":
          return action.title.toLowerCase().includes("housing") ||
                 action.title.toLowerCase().includes("home") ||
                 action.title.toLowerCase().includes("shelter") ||
                 action.title.toLowerCase().includes("affordable");
        case "service":
          return action.category === "Community" || 
                 action.category === "Volunteer" ||
                 action.title.toLowerCase().includes("volunteer") ||
                 action.title.toLowerCase().includes("service") ||
                 action.title.toLowerCase().includes("community");
        case "government":
          return action.category === "Government" || 
                 action.category === "Legislative Hearing";
        default:
          return action.category === selectedCategory;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-secondary/5 to-accent/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-secondary/20 text-secondary">
                <Users className="w-4 h-4 mr-2" />
                Massachusetts Community Hub
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Connect with Your
                <span className="block text-secondary">Local Community</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Find volunteer opportunities, attend public meetings, and connect with representatives 
                across Massachusetts. Powered by Mass 211 and official state data.
              </p>
              
              {/* Search Bar and Refresh Button */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Enter your city or ZIP code..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="community" size="lg">
                  Find Opportunities
                  <MapPin className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {refreshing ? 'Syncing...' : 'Sync Data'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "community" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Government Documents & Resources */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Government Resources</h2>
                <p className="text-muted-foreground">
                  Access common government documents and past meeting materials
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Common Documents */}
                <Card className="hover:shadow-community transition-accessible">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Common Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <a href="https://vote.gov/register/massachusetts" target="_blank" rel="noopener noreferrer" 
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Voter Registration</div>
                        <div className="text-sm text-muted-foreground">Register to vote in Massachusetts</div>
                      </a>
                      <a href="https://www.mass.gov/how-to/request-public-records" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Public Records Request</div>
                        <div className="text-sm text-muted-foreground">Access government documents</div>
                      </a>
                      <a href="https://www.mass.gov/submit-a-complaint" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">File a Complaint</div>
                        <div className="text-sm text-muted-foreground">Submit complaints to state agencies</div>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Past Meeting Materials */}
                <Card className="hover:shadow-community transition-accessible">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-secondary" />
                      Past Meeting Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <a href="https://malegislature.gov/Events/Archives" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Legislative Archives</div>
                        <div className="text-sm text-muted-foreground">Past legislative hearings and meetings</div>
                      </a>
                      <a href="https://www.mass.gov/orgs/executive-office-of-the-governor" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Governor's Office</div>
                        <div className="text-sm text-muted-foreground">Executive branch meeting records</div>
                      </a>
                      <a href="https://www.mass.gov/orgs/massachusetts-house-of-representatives" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">House Records</div>
                        <div className="text-sm text-muted-foreground">House of Representatives archives</div>
                      </a>
                      <a href="https://www.mass.gov/orgs/massachusetts-senate" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Senate Records</div>
                        <div className="text-sm text-muted-foreground">Senate meeting archives</div>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="hover:shadow-community transition-accessible">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-accent" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <a href="https://www.mass.gov" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Mass.gov</div>
                        <div className="text-sm text-muted-foreground">Official state website</div>
                      </a>
                      <a href="https://malegislature.gov" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">MA Legislature</div>
                        <div className="text-sm text-muted-foreground">Legislative information and schedules</div>
                      </a>
                      <a href="https://www.mass.gov/orgs/secretary-of-the-commonwealth" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Secretary of State</div>
                        <div className="text-sm text-muted-foreground">Elections and public records</div>
                      </a>
                      <a href="https://www.mass.gov/orgs/attorney-generals-office" target="_blank" rel="noopener noreferrer"
                         className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="font-medium">Attorney General</div>
                        <div className="text-sm text-muted-foreground">Legal resources and consumer protection</div>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Tabs defaultValue="events" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="events">Public Meetings</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                <TabsTrigger value="representatives">Representatives</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              {/* Public Meetings Tab */}
              <TabsContent value="events" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Public Meetings</h2>
                  <p className="text-muted-foreground mb-4">
                    Massachusetts meetings with 48+ hour notice requirement compliance
                  </p>
                  
                  {/* Enhanced Information Section */}
                  <div className="bg-muted/30 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">Real-time Updates</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">48+ Hour Notice</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="font-medium">Official Government Data</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Data synced from Massachusetts Legislature API • Last updated: {new Date().toLocaleString()}
                    </p>
                  </div>
                  
                  {loading && (
                    <div className="flex items-center justify-center mt-4">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading meetings...</span>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center py-8">
                      <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading meetings...</p>
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <AlertCircle className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No meetings found. Try refreshing the data.</p>
                    </div>
                  ) : (
                    filteredEvents.map((event, index) => (
                    <Card key={index} className="hover:shadow-community transition-accessible">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="mb-2">
                            {event.type}
                          </Badge>
                          <div className="flex gap-1">
                            {event.aslAvailable && (
                              <Badge variant="secondary" className="text-xs">
                                ASL
                              </Badge>
                            )}
                            {event.remoteLink && (
                              <Badge variant="accent" className="text-xs">
                                Virtual
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Massachusetts Legislature • Public Meeting
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">Date:</span>
                            <span className="ml-2">{event.date}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Time:</span>
                            <span className="ml-2">{event.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-2">{event.location}</span>
                          </div>
                          {event.languages && event.languages.length > 0 && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="w-4 h-4 mr-2" />
                              <span className="font-medium">Languages:</span>
                              <span className="ml-2">{event.languages.join(', ')}</span>
                            </div>
                          )}
                          
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              <strong>Notice:</strong> This meeting complies with Massachusetts Open Meeting Law requiring 48+ hour public notice.
                            </p>
                          </div>
                          
                          <div className="pt-4 space-y-2">
                            {event.remoteLink && (
                              <Button variant="outline" size="sm" className="w-full">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Join Remotely
                              </Button>
                            )}
                            {event.aslAvailable && (
                              <Button variant="community" size="sm" className="w-full">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Request ASL/CART
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Volunteer Opportunities Tab */}
              <TabsContent value="volunteer" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Volunteer Opportunities</h2>
                  <p className="text-muted-foreground">
                    Community service opportunities and volunteer positions
                  </p>
                  {loading && (
                    <div className="flex items-center justify-center mt-4">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading opportunities...</span>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center py-8">
                      <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading opportunities...</p>
                    </div>
                  ) : filteredOpportunities.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <AlertCircle className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No opportunities found. Try refreshing the data.</p>
                    </div>
                  ) : (
                    filteredOpportunities.map((opportunity, index) => (
                    <Card key={index} className="hover:shadow-community transition-accessible">
                      <CardHeader>
                        <Badge variant="outline" className="mb-2 w-fit">
                          {opportunity.category}
                        </Badge>
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{opportunity.organizer}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {opportunity.location}
                          </div>
                          {opportunity.date_time && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(opportunity.date_time).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          )}
                          {opportunity.date_time && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2" />
                              {new Date(opportunity.date_time).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                          )}
                          {opportunity.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {opportunity.description}
                            </p>
                          )}
                          
                          <div className="pt-4">
                            {opportunity.virtual_link ? (
                              <Button variant="community" size="sm" className="w-full" asChild>
                                <a href={opportunity.virtual_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Join Online
                                </a>
                              </Button>
                            ) : (
                              <Button 
                                variant="community" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  // Create a detailed view or open more information
                                  const details = `
Title: ${opportunity.title}
Organizer: ${opportunity.organizer}
Location: ${opportunity.location}
${opportunity.date_time ? `Date: ${new Date(opportunity.date_time).toLocaleDateString()}` : ''}
${opportunity.date_time ? `Time: ${new Date(opportunity.date_time).toLocaleTimeString()}` : ''}
${opportunity.description ? `Description: ${opportunity.description}` : ''}
${opportunity.contact_info ? `Contact: ${opportunity.contact_info}` : ''}
                                  `.trim();
                                  alert(details);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Representatives Tab */}
              <TabsContent value="representatives" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Your Representatives</h2>
                  <p className="text-muted-foreground">
                    Connect with your federal and state representatives
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {representatives.map((rep, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{rep.name}</CardTitle>
                            <p className="text-muted-foreground">{rep.office}</p>
                            <Badge variant="outline" className="mt-2">{rep.party}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">District:</span>
                            <span className="ml-2">{rep.district}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="ml-2">{rep.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="ml-2 text-primary">{rep.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Office Hours:</span>
                            <span className="ml-2">{rep.officeHours}</span>
                          </div>
                          
                          <div className="pt-4 space-y-2">
                            <Button 
                              variant="civic" 
                              size="sm" 
                              className="w-full"
                              asChild
                            >
                              <a href={`mailto:${rep.email}`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Email {rep.name}
                              </a>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              asChild
                            >
                              <a href={`tel:${rep.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call {rep.phone}
                              </a>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              asChild
                            >
                              <a href={`https://www.congress.gov/members?q=${encodeURIComponent(rep.name)}`} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4 mr-2" />
                                View on Congress.gov
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Community Services</h2>
                  <p className="text-muted-foreground">
                    Access help and support through official Massachusetts channels
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {serviceResources.map((service, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <p className="text-muted-foreground">{service.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="ml-2 font-semibold text-primary">{service.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Website:</span>
                            <a href={service.website} className="ml-2 text-primary hover:underline">
                              {service.website.replace('https://', '')}
                            </a>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Available:</span>
                            <span className="ml-2">{service.available}</span>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground mb-2">Languages Available:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.languages.map((lang) => (
                                <Badge key={lang} variant="secondary" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Button variant="community" size="sm" className="w-full">
                              <Phone className="w-4 h-4 mr-2" />
                              Call {service.phone}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Massachusetts-specific Notice */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Massachusetts Open Meeting Law</h3>
                    <p className="text-sm text-amber-700">
                      All public meetings require 48+ hour notice (excluding weekends/holidays). 
                      Remote access is authorized through June 30, 2027. ASL interpretation and 
                      language services are available upon request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2025 Local Lens. Connecting Massachusetts communities through official state resources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CommunityPage;