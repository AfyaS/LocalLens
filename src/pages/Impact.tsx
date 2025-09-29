import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Star
} from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  actionsCreated: number;
  totalEngagement: number;
  impactScore: number;
  badges: string[];
  monthlyActivity: { month: string; actions: number }[];
}

const ImpactPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const actions = await azureApi.getCivicActions();
      // Filter actions by created_by if needed
      const userActions = actions.filter(action => action.created_by === user?.id);

      const actionsCreated = userActions?.length || 0;
      const totalEngagement = actionsCreated * 25;
      const impactScore = Math.min(actionsCreated * 50 + totalEngagement * 2, 1000);
      
      const badges = [];
      if (actionsCreated >= 1) badges.push("First Steps");
      if (actionsCreated >= 5) badges.push("Community Builder");
      if (actionsCreated >= 10) badges.push("Civic Leader");
      if (impactScore >= 500) badges.push("Impact Champion");
      
      // Add civic activity badges
      if (actionsCreated >= 1) badges.push("1 Civic Activity");
      if (actionsCreated >= 5) badges.push("5 Civic Activities");
      if (actionsCreated >= 10) badges.push("10 Civic Activities");

      const monthlyActivity = [
        { month: "Oct", actions: Math.max(0, actionsCreated - 3) },
        { month: "Nov", actions: Math.max(0, actionsCreated - 2) },
        { month: "Dec", actions: Math.max(0, actionsCreated - 1) },
        { month: "Jan", actions: actionsCreated }
      ];

      setStats({
        actionsCreated,
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
      </main>
    </div>
  );
};

export default ImpactPage;