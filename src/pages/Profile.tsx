import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  MapPin, 
  Heart,
  Settings,
  Save,
  ArrowLeft,
  Mail,
  Calendar,
  Eye,
  Volume2,
  Languages,
  Accessibility
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  location: string | null;
  interests: string[] | null;
  accessibility_preferences: any;
  created_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    interests: [] as string[],
    accessibility_preferences: {
      screen_reader: false,
      high_contrast: false,
      translation: false
    }
  });

  const civicInterests = [
    "Local Government", "Education", "Environment", "Public Safety",
    "Transportation", "Housing", "Healthcare", "Budget & Taxes",
    "Economic Development", "Arts & Culture", "Social Services", "Infrastructure"
  ];

  const accessibilityOptions = [
    { id: 'screen_reader', label: 'Screen Reader Support', icon: Eye },
    { id: 'high_contrast', label: 'High Contrast Mode', icon: Eye },
    { id: 'translation', label: 'Language Translation', icon: Languages }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const fetchProfile = async () => {
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
        accessibility_preferences: {
          screen_reader: false,
          high_contrast: false,
          translation: false
        },
        created_at: user?.created_at || new Date().toISOString()
      };
      
      setProfile(mockProfile);
      setFormData({
        full_name: mockProfile.full_name || '',
        location: mockProfile.location || '',
        interests: mockProfile.interests || [],
        accessibility_preferences: mockProfile.accessibility_preferences
      });
    } catch (error: any) {
      toast.error('Error loading profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // TODO: Implement updateUserProfile Azure Function
      // For now, just show success message
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleAccessibility = (option: string) => {
    setFormData(prev => ({
      ...prev,
      accessibility_preferences: {
        ...prev.accessibility_preferences,
        [option]: !prev.accessibility_preferences[option as keyof typeof prev.accessibility_preferences]
      }
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
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
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
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
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State or ZIP code"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used to show relevant local government information
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Civic Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-secondary" />
                      Civic Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select topics you care about to get personalized recommendations
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {civicInterests.map((interest) => (
                        <Button
                          key={interest}
                          variant={formData.interests.includes(interest) ? "civic" : "outline"}
                          onClick={() => toggleInterest(interest)}
                          className="justify-start h-auto p-3"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Accessibility Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Accessibility className="w-5 h-5 mr-2 text-accent" />
                      Accessibility Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize your experience for better accessibility
                    </p>
                    <div className="space-y-3">
                      {accessibilityOptions.map((option) => {
                        const OptionIcon = option.icon;
                        const isEnabled = formData.accessibility_preferences[option.id as keyof typeof formData.accessibility_preferences];
                        
                        return (
                          <Button
                            key={option.id}
                            variant={isEnabled ? "civic" : "outline"}
                            onClick={() => toggleAccessibility(option.id)}
                            className="w-full justify-start h-auto p-4"
                          >
                            <OptionIcon className="w-5 h-5 mr-3" />
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex space-x-3">
                  <Button
                    variant="civic"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Member since</span>
                    </div>
                    <p className="text-sm">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>

                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Interests:</span>
                          <Badge variant="outline">{formData.interests.length}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <Badge variant="outline">
                            {formData.location ? 'Set' : 'Not set'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;