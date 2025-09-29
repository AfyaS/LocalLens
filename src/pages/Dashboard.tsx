import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Heart,
  FileText,
  MessageSquare,
  Star,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  full_name: string | null;
  location: string | null;
  interests: string[] | null;
  accessibility_preferences: any;
}

interface CivicAction {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  date_time: string | null;
  organizer: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActions, setRecentActions] = useState<CivicAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchRecentActions();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      // For now, create a mock profile from user data
      // TODO: Implement getUserProfile Azure Function
      const mockProfile = {
        id: user?.id || '',
        full_name: user?.full_name || 'User',
        location: null,
        interests: [],
        bio: null,
        avatar_url: null,
        created_at: user?.created_at || new Date().toISOString()
      };
      setProfile(mockProfile);
    } catch (error: any) {
      toast.error('Error loading profile: ' + error.message);
    }
  };

  const fetchRecentActions = async () => {
    try {
      const actions = await azureApi.getCivicActions();
      // Sort by date and limit to 6 most recent
      const sortedActions = actions
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
        .slice(0, 6);
      setRecentActions(sortedActions);
    } catch (error: any) {
      toast.error('Error loading civic actions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const welcomeMessage = profile?.full_name 
    ? `Welcome back, ${profile.full_name.split(' ')[0]}!`
    : 'Welcome to your dashboard!';

  const completedSetup = profile?.location && profile?.interests?.length;
  const setupProgress = completedSetup ? 100 : 50;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {welcomeMessage}
                  </h1>
                  <p className="text-muted-foreground">
                    Track your civic engagement and discover new opportunities in Massachusetts.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link to="/profile">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link to="/create-action">
                    <Button variant="civic">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Action
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Setup Progress */}
              {!completedSetup && (
                <Card className="mb-8 border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Add your location and interests to get personalized recommendations
                        </p>
                      </div>
                      <Badge variant="outline" className="text-accent border-accent/20">
                        {setupProgress}% Complete
                      </Badge>
                    </div>
                    <Progress value={setupProgress} className="mb-4" />
                    <Link to="/get-started">
                      <Button variant="accent" size="sm">
                        Complete Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-civic flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">5</div>
                    <div className="text-sm text-muted-foreground">Upcoming Events</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-community flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Actions Taken</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-impact flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">28</div>
                    <div className="text-sm text-muted-foreground">Hours Volunteered</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-civic flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">340</div>
                    <div className="text-sm text-muted-foreground">Impact Score</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Civic Actions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        Recent Civic Actions
                      </CardTitle>
                      <Link to="/community">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActions.length > 0 ? (
                        recentActions.slice(0, 3).map((action) => (
                          <Link key={action.id} to={`/action/${action.id}`}>
                            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground text-sm hover:text-primary transition-colors">
                                  {action.title}
                                </h4>
                                {action.location && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {action.location}
                                  </div>
                                )}
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(action.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No civic actions yet</p>
                          <Link to="/community">
                            <Button variant="civic" size="sm" className="mt-2">
                              Explore Opportunities
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-accent" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Link to="/community?tab=events">
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-3" />
                          Find Public Meetings
                        </Button>
                      </Link>
                      
                      <Link to="/community?tab=volunteer">
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="w-4 h-4 mr-3" />
                          Volunteer Opportunities
                        </Button>
                      </Link>

                      <Link to="/community?tab=representatives">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-3" />
                          Contact Representatives
                        </Button>
                      </Link>

                      <Link to="/impact">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-3" />
                          Track Your Impact
                        </Button>
                      </Link>

                      <Link to="/accessibility">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-3" />
                          Accessibility Features
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;