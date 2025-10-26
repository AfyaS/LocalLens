import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  Calendar,
  MapPin,
  Share2,
  Download,
  Target,
  Zap,
  Heart,
  CheckCircle,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  actionsCreated: number;
  totalEngagement: number;
  impactScore: number;
  badges: string[];
  monthlyActivity: { month: string; actions: number }[];
}

interface TrackedActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  impact_type: string;
  people_reached: number;
  hours_spent: number;
  location: string;
  notes: string;
  created_at: string;
}

interface NewActivityForm {
  title: string;
  description: string;
  category: string;
  date: string;
  impact_type: string;
  people_reached: number;
  hours_spent: number;
  location: string;
  notes: string;
}

const ImpactPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackedActivities, setTrackedActivities] = useState<TrackedActivity[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<NewActivityForm>({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    impact_type: '',
    people_reached: 0,
    hours_spent: 0,
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchTrackedActivities();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Use a default user ID if user is not authenticated
      const userId = user?.id || '3C7FBA7E-21B6-4E35-9014-D787BACEF284';
      
      // Get civic actions from the main table
      const actions = await azureApi.getCivicActions();
      const userActions = actions.filter(action => action.created_by === userId);
      
      // Get tracked activities from the impact tracking table
      const trackedActivities = await azureApi.getTrackedActivities(userId);
      
      // Calculate combined stats
      const actionsCreated = userActions?.length || 0;
      const trackedActivitiesCount = trackedActivities?.length || 0;
      const totalActivities = actionsCreated + trackedActivitiesCount;
      
      // Calculate people reached from tracked activities
      const totalPeopleReached = trackedActivities.reduce((sum, activity) => sum + (activity.people_reached || 0), 0);
      const totalEngagement = totalPeopleReached + (actionsCreated * 25);
      
      // Calculate impact score based on activities and people reached
      const impactScore = Math.min(
        (totalActivities * 50) + (totalPeopleReached * 2) + (trackedActivities.reduce((sum, activity) => sum + (activity.hours_spent || 0), 0) * 5),
        1000
      );
      
      const badges = [];
      if (totalActivities >= 1) badges.push("First Steps");
      if (totalActivities >= 5) badges.push("Community Builder");
      if (totalActivities >= 10) badges.push("Civic Leader");
      if (impactScore >= 500) badges.push("Impact Champion");
      
      // Add civic activity badges
      if (totalActivities >= 1) badges.push("1 Civic Activity");
      if (totalActivities >= 5) badges.push("5 Civic Activities");
      if (totalActivities >= 10) badges.push("10 Civic Activities");

      const monthlyActivity = [
        { month: "Oct", actions: Math.max(0, totalActivities - 3) },
        { month: "Nov", actions: Math.max(0, totalActivities - 2) },
        { month: "Dec", actions: Math.max(0, totalActivities - 1) },
        { month: "Jan", actions: totalActivities }
      ];

      setStats({
        actionsCreated: totalActivities,
        totalEngagement,
        impactScore,
        badges,
        monthlyActivity
      });
    } catch (error: any) {
      toast.error('Error loading impact data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackedActivities = async () => {
    try {
      // Use a default user ID if user is not authenticated
      const userId = user?.id || '3C7FBA7E-21B6-4E35-9014-D787BACEF284'; // Default test user
      
      const activities = await azureApi.getTrackedActivities(userId);
      setTrackedActivities(activities);
    } catch (error: any) {
      console.error('Error fetching tracked activities:', error);
      // Fallback to mock data if API fails
      const mockActivities: TrackedActivity[] = [
        {
          id: '1',
          user_id: user?.id || '3C7FBA7E-21B6-4E35-9014-D787BACEF284',
          title: 'Volunteered at Food Bank',
          description: 'Helped distribute food to families in need',
          category: 'Community Service',
          date: '2024-01-15',
          impact_type: 'Direct Service',
          people_reached: 50,
          hours_spent: 4,
          location: 'Boston Food Bank',
          notes: 'Great experience helping the community',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ];
      setTrackedActivities(mockActivities);
    }
  };

  const handleAddActivity = async () => {
    try {
      // Validate required fields
      if (!newActivity.title || !newActivity.description || !newActivity.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Use a default user ID if user is not authenticated
      const userId = user?.id || '3C7FBA7E-21B6-4E35-9014-D787BACEF284'; // Default test user

      // Submit to API
      const result = await azureApi.trackImpact(userId, newActivity);
      
      if (result.success) {
        // Refresh the activities list and stats
        await fetchTrackedActivities();
        await fetchUserStats();
        
        // Reset form
        setNewActivity({
          title: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          impact_type: '',
          people_reached: 0,
          hours_spent: 0,
          location: '',
          notes: ''
        });
        setShowAddForm(false);
        toast.success('Activity tracked successfully!');
      } else {
        toast.error('Failed to track activity');
      }
    } catch (error: any) {
      console.error('Error adding activity:', error);
      toast.error('Error adding activity: ' + error.message);
    }
  };

  const shareImpact = async () => {
    const impactText = `I've created ${stats?.actionsCreated || 0} civic actions and reached ${stats?.totalEngagement || 0} people in my community! My impact score is ${stats?.impactScore || 0}. Join me in making a difference with Local Lens!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Civic Impact',
          text: impactText,
          url: window.location.href
        });
        toast.success('Impact shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        navigator.clipboard.writeText(impactText);
        toast.success('Impact summary copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(impactText);
      toast.success('Impact summary copied to clipboard!');
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch('https://community-clarity-func-v2.azurewebsites.net/api/impact/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civic-impact-report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Track Your Civic Impact</h1>
              <p className="text-muted-foreground mb-8">
                Sign in to see how your civic actions are making a difference in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="civic">Sign In to View Impact</Button>
                <Button variant="outline">Learn More About Impact Tracking</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your impact data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Your Civic Journey
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Your Community
                  <span className="block gradient-impact bg-clip-text text-transparent">
                    Impact Story
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Every action you take creates ripples of positive change. Here's how your civic engagement is making a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="civic" onClick={shareImpact}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Your Impact
                  </Button>
                  <Button variant="outline" onClick={downloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-civic flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats?.actionsCreated || 0}</div>
                    <div className="text-sm text-muted-foreground">Actions Created</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-community flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats?.totalEngagement || 0}</div>
                    <div className="text-sm text-muted-foreground">People Reached</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-impact flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats?.impactScore || 0}</div>
                    <div className="text-sm text-muted-foreground">Impact Score</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-civic flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats?.badges.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Badges Earned</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Your Achievements</h2>
                <p className="text-muted-foreground">
                  Badges you've earned through civic engagement
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats?.badges.map((badge, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 rounded-full gradient-civic flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{badge}</h3>
                      <p className="text-sm text-muted-foreground">
                        {badge === "First Steps" && "Completed your first civic action"}
                        {badge === "Community Builder" && "Created 5+ civic actions"}
                        {badge === "Civic Leader" && "Created 10+ civic actions"}
                        {badge === "Impact Champion" && "Reached 500+ impact score"}
                        {badge === "1 Civic Activity" && "Completed your first civic activity"}
                        {badge === "5 Civic Activities" && "Completed 5 civic activities"}
                        {badge === "10 Civic Activities" && "Completed 10 civic activities"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Track Your Impact */}
        <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Track Your Impact</h2>
                <p className="text-muted-foreground mb-8">
                  Log your civic activities and see how you're making a difference in your community
                </p>
                
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                  <DialogTrigger asChild>
                    <Button variant="civic" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Track New Civic Activity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                          Activity Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Volunteered at Food Bank"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what you did and its impact"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category" className="text-sm font-medium">
                            Category <span className="text-red-500">*</span>
                          </Label>
                          <Select value={newActivity.category} onValueChange={(value) => setNewActivity(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="mt-1 bg-white border border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300 shadow-lg">
                              <SelectItem value="Community Service" className="text-gray-900 hover:bg-gray-100">Community Service</SelectItem>
                              <SelectItem value="Volunteering" className="text-gray-900 hover:bg-gray-100">Volunteering</SelectItem>
                              <SelectItem value="Advocacy" className="text-gray-900 hover:bg-gray-100">Advocacy</SelectItem>
                              <SelectItem value="Education" className="text-gray-900 hover:bg-gray-100">Education</SelectItem>
                              <SelectItem value="Environmental" className="text-gray-900 hover:bg-gray-100">Environmental</SelectItem>
                              <SelectItem value="Health" className="text-gray-900 hover:bg-gray-100">Health</SelectItem>
                              <SelectItem value="Other" className="text-gray-900 hover:bg-gray-100">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newActivity.date}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="impact_type" className="text-sm font-medium">Impact Type</Label>
                          <Select value={newActivity.impact_type} onValueChange={(value) => setNewActivity(prev => ({ ...prev, impact_type: value }))}>
                            <SelectTrigger className="mt-1 bg-white border border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select impact type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300 shadow-lg">
                              <SelectItem value="Direct Service" className="text-gray-900 hover:bg-gray-100">Direct Service</SelectItem>
                              <SelectItem value="Advocacy" className="text-gray-900 hover:bg-gray-100">Advocacy</SelectItem>
                              <SelectItem value="Education" className="text-gray-900 hover:bg-gray-100">Education</SelectItem>
                              <SelectItem value="Fundraising" className="text-gray-900 hover:bg-gray-100">Fundraising</SelectItem>
                              <SelectItem value="Organizing" className="text-gray-900 hover:bg-gray-100">Organizing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                          <Input
                            id="location"
                            value={newActivity.location}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Where did this take place?"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="people_reached" className="text-sm font-medium">People Reached</Label>
                          <Input
                            id="people_reached"
                            type="number"
                            value={newActivity.people_reached}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, people_reached: parseInt(e.target.value) || 0 }))}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="hours_spent" className="text-sm font-medium">Hours Spent</Label>
                          <Input
                            id="hours_spent"
                            type="number"
                            value={newActivity.hours_spent}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, hours_spent: parseInt(e.target.value) || 0 }))}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={newActivity.notes}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any additional thoughts or reflections"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddActivity}>
                          Track Activity
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tracked Activities List */}
              <div className="space-y-4">
                {trackedActivities.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Activities Tracked Yet</h3>
                      <p className="text-muted-foreground mb-4">Start tracking your civic impact by adding your first activity</p>
                      <Button variant="civic" onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Activity
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  trackedActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">{activity.title}</h3>
                            <p className="text-muted-foreground mb-3">{activity.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Category</div>
                            <div className="font-medium">{activity.category}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Date</div>
                            <div className="font-medium">{new Date(activity.date).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">People Reached</div>
                            <div className="font-medium">{activity.people_reached}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Hours Spent</div>
                            <div className="font-medium">{activity.hours_spent}</div>
                          </div>
                        </div>
                        
                        {activity.location && (
                          <div className="mb-2">
                            <div className="text-sm text-muted-foreground">Location</div>
                            <div className="font-medium">{activity.location}</div>
                          </div>
                        )}
                        
                        {activity.notes && (
                          <div>
                            <div className="text-sm text-muted-foreground">Notes</div>
                            <div className="font-medium">{activity.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImpactPage;