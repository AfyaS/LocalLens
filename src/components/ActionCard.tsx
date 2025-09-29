import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Heart,
  MessageSquare,
  Share2,
  ExternalLink,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CivicAction {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  date_time: string | null;
  organizer: string | null;
  created_by: string | null;
  created_at: string;
}

interface ActionCardProps {
  action: CivicAction;
  onInterestToggle?: (actionId: string) => void;
  isInterested?: boolean;
  showDescription?: boolean;
  variant?: 'default' | 'compact';
}

const ActionCard = ({ 
  action, 
  onInterestToggle, 
  isInterested = false, 
  showDescription = true,
  variant = 'default'
}: ActionCardProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = async () => {
    if (!user) {
      toast.error('Please sign in to express interest');
      return;
    }

    setIsLoading(true);
    try {
      if (onInterestToggle) {
        await onInterestToggle(action.id);
      }
      toast.success(isInterested ? 'Removed from interests' : 'Added to interests');
    } catch (error) {
      toast.error('Error updating interest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: action.title,
        text: action.description || '',
        url: `${window.location.origin}/action/${action.id}`,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/action/${action.id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isUpcoming = action.date_time && new Date(action.date_time) > new Date();
  const isPast = action.date_time && new Date(action.date_time) < new Date();

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-community transition-accessible cursor-pointer">
        <Link to={`/action/${action.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {action.category && (
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                  )}
                  {isUpcoming && (
                    <Badge variant="secondary" className="text-xs">
                      Upcoming
                    </Badge>
                  )}
                  {isPast && (
                    <Badge variant="secondary" className="text-xs opacity-60">
                      Past
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {action.title}
                </h3>
                
                <div className="space-y-1">
                  {action.date_time && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(action.date_time)} at {formatTime(action.date_time)}
                    </div>
                  )}
                  
                  {action.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{action.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleInterestToggle();
                }}
                disabled={isLoading}
                className="ml-2 h-8 w-8 p-0"
              >
                <Heart className={`w-4 h-4 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-community transition-accessible group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              {action.category && (
                <Badge variant="outline">
                  {action.category}
                </Badge>
              )}
              {isUpcoming && (
                <Badge variant="secondary">
                  Upcoming
                </Badge>
              )}
              {isPast && (
                <Badge variant="secondary" className="opacity-60">
                  Past Event
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              <Link to={`/action/${action.id}`} className="hover:underline">
                {action.title}
              </Link>
            </CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/action/${action.id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showDescription && action.description && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {action.description}
          </p>
        )}
        
        <div className="space-y-2">
          {action.date_time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(action.date_time)}
              <Clock className="w-4 h-4 mr-2 ml-4" />
              {formatTime(action.date_time)}
            </div>
          )}
          
          {action.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {action.location}
            </div>
          )}
          
          {action.organizer && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              {action.organizer}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInterestToggle}
              disabled={isLoading}
              className="text-xs"
            >
              <Heart className={`w-3 h-3 mr-1 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
              {isLoading ? 'Loading...' : isInterested ? 'Interested' : 'Interest'}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Comment
            </Button>
          </div>
          
          <Link to={`/action/${action.id}`}>
            <Button variant="civic" size="sm" className="text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;