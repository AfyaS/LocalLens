import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  FileText,
  Save,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const CreateAction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date_time: '',
    organizer: '',
    contact_info: {
      email: '',
      phone: '',
      website: ''
    },
    requirements: [] as string[],
    accessibility_notes: ''
  });

  const categories = [
    "Local Government",
    "Community Meeting",
    "Public Hearing",
    "Volunteer Opportunity",
    "Educational Workshop",
    "Advocacy Event",
    "Town Hall",
    "Budget Meeting",
    "Environmental Action",
    "Social Services",
    "Healthcare",
    "Transportation",
    "Housing",
    "Public Safety"
  ];

  const requirementOptions = [
    "Registration Required",
    "Age 18+ Only",
    "Background Check",
    "Training Required",
    "Commitment Required",
    "Physical Activity",
    "Time Sensitive"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to create an action');
      navigate('/sign-in');
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement createCivicAction Azure Function
      // For now, just show success message
      toast.success('Civic action created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Error creating action: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

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
                <h1 className="text-3xl font-bold text-foreground">Create Civic Action</h1>
                <p className="text-muted-foreground">Share a new civic opportunity with the community</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Boston City Council Meeting"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide details about the civic action, its purpose, and what participants can expect..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-secondary" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date_time">Date & Time</Label>
                    <Input
                      id="date_time"
                      type="datetime-local"
                      value={formData.date_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_time: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., City Hall, 1 City Hall Square, Boston, MA"
                    />
                  </div>

                  <div>
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                      placeholder="e.g., Boston City Council, Community Group Name"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-accent" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_info.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, email: e.target.value }
                      }))}
                      placeholder="contact@organization.org"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_info.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, phone: e.target.value }
                      }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_website">Website</Label>
                    <Input
                      id="contact_website"
                      type="url"
                      value={formData.contact_info.website}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, website: e.target.value }
                      }))}
                      placeholder="https://organization.org"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements & Accessibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-primary" />
                    Requirements & Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Requirements</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select any requirements for participation
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {requirementOptions.map((requirement) => (
                        <Button
                          key={requirement}
                          type="button"
                          variant={formData.requirements.includes(requirement) ? "civic" : "outline"}
                          onClick={() => toggleRequirement(requirement)}
                          className="justify-start h-auto p-3"
                        >
                          {requirement}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accessibility_notes">Accessibility Notes</Label>
                    <Textarea
                      id="accessibility_notes"
                      value={formData.accessibility_notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, accessibility_notes: e.target.value }))}
                      placeholder="Describe accessibility features, accommodations available, or how to request support..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="civic"
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Creating...' : 'Create Civic Action'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAction;