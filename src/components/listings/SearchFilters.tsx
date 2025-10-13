import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Filters {
  location: string;
  minPrice: string;
  maxPrice: string;
  status: string;
}

interface SearchFiltersProps {
  filters: Filters;
  searchQuery: string;
  onFiltersChange: (filters: Filters) => void;
  onSearchChange: (query: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchChange,
}) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: "",
      minPrice: "",
      maxPrice: "",
      status: "listed",
    });
    onSearchChange("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-muted p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="lg:w-48">
          <Input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="flex gap-2 lg:w-64">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-32">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm bg-white border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
          >
            <option value="listed">Listed</option>
            <option value="rented">Rented</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="lg:w-auto border-muted hover:border-primary hover:text-primary"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
