import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar as CalendarIcon,
  X,
  SlidersHorizontal
} from "lucide-react";
import { format } from "date-fns";

interface SearchFiltersProps {
  onSearchChange: (search: string) => void;
  onLocationChange: (location: string) => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onOrganizerChange: (organizer: string) => void;
  searchValue: string;
  locationValue: string;
  categoryValue: string;
  dateValue: Date | undefined;
  organizerValue: string;
  resultCount?: number;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "government", label: "Government" },
  { value: "environment", label: "Environment" },
  { value: "housing", label: "Housing" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "transportation", label: "Transportation" },
  { value: "community", label: "Community Service" },
  { value: "advocacy", label: "Advocacy" },
  { value: "volunteer", label: "Volunteer" }
];

const SearchFilters = ({
  onSearchChange,
  onLocationChange,
  onCategoryChange,
  onDateChange,
  onOrganizerChange,
  searchValue,
  locationValue,
  categoryValue,
  dateValue,
  organizerValue,
  resultCount
}: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const clearAllFilters = () => {
    onSearchChange("");
    onLocationChange("");
    onCategoryChange("all");
    onDateChange(undefined);
    onOrganizerChange("");
  };

  const activeFiltersCount = [
    searchValue,
    locationValue,
    categoryValue !== "all" ? categoryValue : "",
    dateValue,
    organizerValue
  ].filter(Boolean).length;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Search className="w-5 h-5 mr-2 text-primary" />
            Search & Filter Actions
            {resultCount !== undefined && (
              <Badge variant="outline" className="ml-3">
                {resultCount} result{resultCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search civic actions, topics, or keywords..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
            {/* Location Filter */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  placeholder="City, ZIP, or Address"
                  value={locationValue}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={categoryValue} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                      onDateChange(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Organizer Filter */}
            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-sm font-medium">
                Organizer
              </Label>
              <Input
                id="organizer"
                placeholder="Organization or person"
                value={organizerValue}
                onChange={(e) => onOrganizerChange(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchValue}
                <button onClick={() => onSearchChange("")} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {locationValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {locationValue}
                <button onClick={() => onLocationChange("")} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {categoryValue !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categories.find(c => c.value === categoryValue)?.label}
                <button onClick={() => onCategoryChange("all")} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {dateValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date: {format(dateValue, "MMM d, yyyy")}
                <button onClick={() => onDateChange(undefined)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {organizerValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Organizer: {organizerValue}
                <button onClick={() => onOrganizerChange("")} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;