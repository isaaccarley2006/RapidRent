import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Typewriter from "typewriter-effect";

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
      <div className="flex flex-col items-center lg:flex-row gap-4">
        {/* Search Input */}

        <div className="flex-1 w-full flex items-center gap-4">
          <div className="bg-gray-50 inline-flex p-0.5 gap-1 rounded-full">
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
          <SearchBox
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex-1 w-full flex gap-4">
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
          <Button onClick={clearFilters}>Clear</Button>
        </div>
      </div>
    </div>
  );
};

export const SearchBox = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // optionally resume typing when blurred
    setIsFocused(false);
  };

  return (
    <div className="relative  w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />

      <Input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="pl-10"
        placeholder=""
      />

      {/* Animated placeholder */}
      {!isFocused && !value && (
        <div
          ref={placeholderRef}
          className="absolute left-10 top-1/2 text-sm transform -translate-y-1/2 text-text-muted pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis w-[calc(100%-2.5rem)]"
        >
          <Typewriter
            options={{
              strings: [
                "Three-bedroom house near tube, pet-friendly.",
                "Pet-friendly three-bed home close to public transport.",
                "Three-bed rental within walking distance of a tube station, pets allowed.",
                "Three-bedroom house in London, pets accepted, near underground.",
              ],
              autoStart: true,
              loop: true,
              delay: 20,
              deleteSpeed: 40,
            }}
          />
        </div>
      )}
    </div>
  );
};
