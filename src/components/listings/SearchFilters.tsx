import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

interface Filters {
  location: string;
  minPrice: string;
  maxPrice: string;
  status: string;
}

interface SearchFiltersProps {
  filters: Filters;
  searchQuery: string;
  listingView: "grid" | "list";
  onFiltersChange: (filters: Filters) => void;
  onSearchChange: (query: string) => void;
  onListingViewChange: (listingView: "grid" | "list") => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  searchQuery,
  listingView,
  onFiltersChange,
  onSearchChange,
  onListingViewChange,
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
    <div className="bg-white rounded-2xl  mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="bg-gray-50 inline-flex p-0.5 gap-1 rounded-xl">
            <Button
              size="icon"
              onClick={() => onListingViewChange("list")}
              variant={listingView === "list" ? "default" : "ghost"}
            >
              <CiGrid2H />
            </Button>
            <Button
              size="icon"
              onClick={() => onListingViewChange("grid")}
              variant={listingView === "grid" ? "default" : "ghost"}
              className=""
            >
              <CiGrid41 />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-4">
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
              className="w-full h-10 px-3 py-2 text-sm bg-white border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
            >
              <option value="listed">Listed</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <Button onClick={clearFilters} className="rounded-xl">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
