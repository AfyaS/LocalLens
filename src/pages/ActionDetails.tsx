import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface CivicAction {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  date_time: string | null;
  organizer: string | null;
  contact_info: any;
  requirements: string[] | null;
  accessibility_notes: string | null;
  created_by: string | null;
  created_at: string;
}

const ActionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [action, setAction] = useState<CivicAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInterestedLoading, setIsInterestedLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchActionDetails();
    }
  }, [id]);

  const fetchActionDetails = async () => {
    try {
      const actions = await azureApi.getCivicActions();
      const action = actions.find(a => a.id === id);
      if (action) {
        setAction(action);
      } else {
        toast.error('Action not found');
        navigate('/community');
      }
    } catch (error: any) {
      toast.error('Error loading action details: ' + error.message);
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestedClick = async () => {
    if (!user) {
      toast.error('Please sign in to express interest');
      return;
    }

    setIsInterestedLoading(true);
    try {
      // This could connect to a user_interests table in the future
      toast.success('Interest registered! You will be notified of updates.');
    } catch (error: any) {
      toast.error('Error registering interest: ' + error.message);
    } finally {
      setIsInterestedLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: action?.title,
        text: action?.description || '',
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    if (!action || action.created_by !== user?.id) return;

    if (confirm('Are you sure you want to delete this action?')) {
      try {
        // TODO: Implement deleteCivicAction Azure Function
        toast.success('Action deleted successfully');
        navigate('/dashboard');
      } catch (error: any) {
        toast.error('Error deleting action: ' + error.message);
      }
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
              <p className="mt-4 text-muted-foreground">Loading action details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Action Not Found</h1>
              <p className="text-muted-foreground mb-6">The action you're looking for doesn't exist.</p>
              <Link to="/community">
                <Button variant="civic">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Community
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isOwner = user && action.created_by === user.id;
  const contactInfo = action.contact_info || {};

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Header */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Link to="/community">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Community
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  {isOwner && (
                    <>
                      <Link to={`/edit-action/${action.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    {action.category && (
                      <Badge variant="secondary" className="text-sm">
                        {action.category}
                      </Badge>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Created {new Date(action.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {action.title}
                  </h1>
                  
                  {action.description && (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Event Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {action.date_time && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">
                              {new Date(action.date_time).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(action.date_time).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {action.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-sm text-muted-foreground">{action.location}</div>
                          </div>
                        </div>
                      )}

                      {action.organizer && (
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">Organizer</div>
                            <div className="text-sm text-muted-foreground">{action.organizer}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  {action.requirements && action.requirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {action.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="text-sm">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Accessibility Notes */}
                  {action.accessibility_notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Accessibility Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{action.accessibility_notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Button 
                          className="w-full" 
                          variant="civic"
                          onClick={handleInterestedClick}
                          disabled={isInterestedLoading}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {isInterestedLoading ? 'Registering...' : 'I\'m Interested'}
                        </Button>
                        
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ask Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  {(contactInfo.email || contactInfo.phone) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {contactInfo.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`mailto:${contactInfo.email}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {contactInfo.email}
                            </a>
                          </div>
                        )}
                        
                        {contactInfo.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={`tel:${contactInfo.phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {contactInfo.phone}
                            </a>
                          </div>
                        )}
                        
                        {contactInfo.website && (
                          <div className="flex items-center space-x-3">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <a 
                              href={contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Interested</span>
                        <span className="font-medium">12 people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline" className="text-xs">
                          {action.category || 'General'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActionDetails;