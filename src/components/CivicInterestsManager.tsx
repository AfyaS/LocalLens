import { useState, useEffect } from "react";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Plus, 
  Search, 
  User,
  Globe,
  Building,
  Leaf,
  GraduationCap,
  Shield,
  Car,
  Home,
  Stethoscope,
  Calculator,
  Hammer
} from "lucide-react";
import { toast } from "sonner";

interface CivicInterest {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

interface CivicInterestsManagerProps {
  userId?: string;
  selectedInterests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  showUserSelection?: boolean;
}

const CivicInterestsManager = ({ 
  userId, 
  selectedInterests = [], 
  onInterestsChange,
  showUserSelection = false 
}: CivicInterestsManagerProps) => {
  const [interests, setInterests] = useState<CivicInterest[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>(selectedInterests);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'government': Building,
    'environment': Leaf,
    'education': GraduationCap,
    'safety': Shield,
    'transport': Car,
    'housing': Home,
    'health': Stethoscope,
    'budget': Calculator,
    'development': Hammer,
    'community': User,
    'global': Globe
  };

  useEffect(() => {
    fetchCivicInterests();
  }, []);

  useEffect(() => {
    if (userId && showUserSelection) {
      fetchUserInterests();
    }
  }, [userId, showUserSelection]);

  const fetchCivicInterests = async () => {
    try {
      // TODO: Implement getCivicInterests Azure Function
      // For now, use mock data
      const mockInterests = [
        { id: '1', name: 'Environment', description: 'Environmental protection and sustainability', icon: 'leaf' },
        { id: '2', name: 'Education', description: 'Educational initiatives and school improvements', icon: 'graduation-cap' },
        { id: '3', name: 'Housing', description: 'Affordable housing and housing policy', icon: 'home' },
        { id: '4', name: 'Healthcare', description: 'Healthcare access and public health', icon: 'stethoscope' },
        { id: '5', name: 'Transportation', description: 'Public transit and transportation infrastructure', icon: 'car' }
      ];
      setInterests(mockInterests);
    } catch (error: any) {
      toast.error('Error loading civic interests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInterests = async () => {
    if (!userId) return;

    try {
      // TODO: Implement getUserInterests Azure Function
      // For now, use mock data
      const mockUserInterests = ['Environment', 'Housing'];
      setUserInterests(mockUserInterests);
      onInterestsChange?.(mockUserInterests);
    } catch (error: any) {
      toast.error('Error loading user interests: ' + error.message);
    }
  };

  const toggleInterest = async (interest: CivicInterest) => {
    const isSelected = userInterests.includes(interest.name);
    
    if (!showUserSelection) {
      // For external use without database integration
      const newInterests = isSelected
        ? userInterests.filter(name => name !== interest.name)
        : [...userInterests, interest.name];
      
      setUserInterests(newInterests);
      onInterestsChange?.(newInterests);
      return;
    }

    if (!userId) return;

    try {
      if (isSelected) {
        // Remove interest
        // TODO: Implement removeUserInterest Azure Function
        setUserInterests(prev => prev.filter(name => name !== interest.name));
        toast.success(`Removed ${interest.name} from your interests`);
      } else {
        // Add interest
        // TODO: Implement addUserInterest Azure Function
        
        setUserInterests(prev => [...prev, interest.name]);
        toast.success(`Added ${interest.name} to your interests`);
      }

      onInterestsChange?.(userInterests);
    } catch (error: any) {
      toast.error('Error updating interests: ' + error.message);
    }
  };

  const filteredInterests = interests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interest.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Heart;
    return iconMap[iconName] || Heart;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading interests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 mr-2 text-secondary" />
          Civic Interests
          {showUserSelection && (
            <Badge variant="outline" className="ml-2">
              {userInterests.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredInterests.map((interest) => {
            const IconComponent = getIcon(interest.icon);
            const isSelected = userInterests.includes(interest.name);
            
            return (
              <Button
                key={interest.id}
                variant={isSelected ? "civic" : "outline"}
                onClick={() => toggleInterest(interest)}
                className="justify-start h-auto p-3 text-left"
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{interest.name}</div>
                    {interest.description && (
                      <div className="text-xs opacity-80 truncate">
                        {interest.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {filteredInterests.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? `No interests found for "${searchTerm}"` : 'No civic interests available'}
            </p>
          </div>
        )}

        {/* Summary */}
        {showUserSelection && userInterests.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Your interests:</p>
            <div className="flex flex-wrap gap-1">
              {userInterests.slice(0, 5).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {userInterests.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{userInterests.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CivicInterestsManager;