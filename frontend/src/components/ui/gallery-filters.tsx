"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Camera, 
  Tag,
  SlidersHorizontal
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface GalleryFiltersProps {
  categories: FilterOption[];
  locations: FilterOption[];
  photographers: FilterOption[];
  tags: FilterOption[];
  selectedFilters: {
    category: string;
    location: string;
    photographer: string;
    tags: string[];
    dateRange: string;
  };
  onFilterChange: (filters: any) => void;
}

export function GalleryFilters({
  categories,
  locations,
  photographers,
  tags,
  selectedFilters,
  onFilterChange
}: GalleryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const hasActiveFilters = 
    selectedFilters.category !== "all" ||
    selectedFilters.location !== "all" ||
    selectedFilters.photographer !== "all" ||
    selectedFilters.tags.length > 0 ||
    selectedFilters.dateRange !== "all";

  const clearAllFilters = () => {
    onFilterChange({
      category: "all",
      location: "all",
      photographer: "all",
      tags: [],
      dateRange: "all"
    });
  };

  const toggleTag = (tagId: string) => {
    const newTags = selectedFilters.tags.includes(tagId)
      ? selectedFilters.tags.filter(t => t !== tagId)
      : [...selectedFilters.tags, tagId];
    
    onFilterChange({
      ...selectedFilters,
      tags: newTags
    });
  };

  return (
    <div className="relative">
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Advanced Filters
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-2">
            {[
              selectedFilters.category !== "all" ? 1 : 0,
              selectedFilters.location !== "all" ? 1 : 0,
              selectedFilters.photographer !== "all" ? 1 : 0,
              selectedFilters.tags.length,
              selectedFilters.dateRange !== "all" ? 1 : 0
            ].reduce((a, b) => a + b, 0)}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Category</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedFilters.category === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange({
                        ...selectedFilters,
                        category: category.id
                      })}
                      className="justify-between text-xs"
                    >
                      {category.label}
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Location</span>
                </div>
                <div className="space-y-2">
                  {locations.slice(0, 5).map((location) => (
                    <Button
                      key={location.id}
                      variant={selectedFilters.location === location.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onFilterChange({
                        ...selectedFilters,
                        location: location.id
                      })}
                      className="w-full justify-between text-xs"
                    >
                      {location.label}
                      <span className="text-muted-foreground">{location.count}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Photographers */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Photographer</span>
                </div>
                <div className="space-y-2">
                  {photographers.slice(0, 4).map((photographer) => (
                    <Button
                      key={photographer.id}
                      variant={selectedFilters.photographer === photographer.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onFilterChange({
                        ...selectedFilters,
                        photographer: photographer.id
                      })}
                      className="w-full justify-between text-xs"
                    >
                      {photographer.label}
                      <span className="text-muted-foreground">{photographer.count}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedFilters.tags.includes(tag.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag.id)}
                      className="text-xs"
                    >
                      #{tag.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Date Range</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "All Time" },
                    { id: "week", label: "This Week" },
                    { id: "month", label: "This Month" },
                    { id: "year", label: "This Year" }
                  ].map((range) => (
                    <Button
                      key={range.id}
                      variant={selectedFilters.dateRange === range.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange({
                        ...selectedFilters,
                        dateRange: range.id
                      })}
                      className="text-xs"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}