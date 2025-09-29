import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SearchFilters from "@/components/SearchFilters";
import ActionCard from "@/components/ActionCard";
import { useAuth } from "@/contexts/AuthContext";
import { azureApi } from "@/lib/azure-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  MapPin,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc
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
  created_by: string | null;
  created_at: string;
}

const BrowseActions = () => {
  const { user } = useAuth();
  const [actions, setActions] = useState<CivicAction[]>([]);
  const [filteredActions, setFilteredActions] = useState<CivicAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestedActions, setInterestedActions] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'location'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Search filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [organizerFilter, setOrganizerFilter] = useState("");

  useEffect(() => {
    fetchActions();
    if (user) {
      fetchUserInterests();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [actions, searchQuery, locationFilter, categoryFilter, dateFilter, organizerFilter, sortBy, sortOrder]);

  const fetchActions = async () => {
    try {
      const actions = await azureApi.getCivicActions();
      setActions(actions);
    } catch (error: any) {
      toast.error('Error loading actions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInterests = async () => {
    // This would fetch user's interested actions from a user_interests table
    // For now, using mock data
    setInterestedActions(new Set(['action1', 'action2']));
  };

  const applyFilters = () => {
    let filtered = [...actions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(action =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (action.description && action.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (action.organizer && action.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(action =>
        action.location && action.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(action => action.category === categoryFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(action => {
        if (!action.date_time) return false;
        const actionDate = new Date(action.date_time);
        return actionDate.toDateString() === dateFilter.toDateString();
      });
    }

    // Organizer filter
    if (organizerFilter) {
      filtered = filtered.filter(action =>
        action.organizer && action.organizer.toLowerCase().includes(organizerFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = a.date_time ? new Date(a.date_time) : new Date(a.created_at);
          const dateB = b.date_time ? new Date(b.date_time) : new Date(b.created_at);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'location':
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredActions(filtered);
  };

  const handleInterestToggle = async (actionId: string) => {
    const newInterests = new Set(interestedActions);
    if (newInterests.has(actionId)) {
      newInterests.delete(actionId);
    } else {
      newInterests.add(actionId);
    }
    setInterestedActions(newInterests);
    
    // Here you would make an API call to update user interests
    // await updateUserInterest(actionId, newInterests.has(actionId));
  };

  const upcomingActions = filteredActions.filter(action => 
    action.date_time && new Date(action.date_time) > new Date()
  );

  const pastActions = filteredActions.filter(action => 
    action.date_time && new Date(action.date_time) < new Date()
  );

  const ongoingActions = filteredActions.filter(action => !action.date_time);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading civic actions...</p>
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
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Browse Civic Actions
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover opportunities to make a difference in your community. 
                  Filter by location, category, or date to find actions that match your interests.
                </p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    {filteredActions.length} action{filteredActions.length !== 1 ? 's' : ''}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SearchFilters
                onSearchChange={setSearchQuery}
                onLocationChange={setLocationFilter}
                onCategoryChange={setCategoryFilter}
                onDateChange={setDateFilter}
                onOrganizerChange={setOrganizerFilter}
                searchValue={searchQuery}
                locationValue={locationFilter}
                categoryValue={categoryFilter}
                dateValue={dateFilter}
                organizerValue={organizerFilter}
                resultCount={filteredActions.length}
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="upcoming" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingActions.length})
                  </TabsTrigger>
                  <TabsTrigger value="ongoing">
                    Ongoing ({ongoingActions.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Past ({pastActions.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-6">
                  {upcomingActions.length > 0 ? (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {upcomingActions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          onInterestToggle={handleInterestToggle}
                          isInterested={interestedActions.has(action.id)}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          showDescription={viewMode === 'grid'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming actions</h3>
                      <p className="text-muted-foreground">Check back later for new opportunities or create your own action.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ongoing" className="space-y-6">
                  {ongoingActions.length > 0 ? (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {ongoingActions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          onInterestToggle={handleInterestToggle}
                          isInterested={interestedActions.has(action.id)}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          showDescription={viewMode === 'grid'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No ongoing actions</h3>
                      <p className="text-muted-foreground">Browse upcoming actions or create a new one.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-6">
                  {pastActions.length > 0 ? (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {pastActions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          onInterestToggle={handleInterestToggle}
                          isInterested={interestedActions.has(action.id)}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          showDescription={viewMode === 'grid'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No past actions</h3>
                      <p className="text-muted-foreground">Past events will appear here once they're completed.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BrowseActions;