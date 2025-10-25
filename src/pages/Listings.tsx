import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { SearchFilters } from "@/components/listings/SearchFilters";

import { useAuth } from "@/contexts/AuthContext";
import useListings from "@/hooks/useListings";
import clsx from "clsx";

interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  location: string | null;
  status: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: boolean;
  property_type: string | null;
  images: string[] | null;
}

interface Filters {
  location: string;
  minPrice: string;
  maxPrice: string;
  status: string;
}

const Listings: React.FC = () => {
  const navigate = useNavigate();
  const [listingView, setListingView] = useState<"list" | "grid">("grid");
  const location = useLocation();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialLocation = searchParams.get("location") || "";

  const [filters, setFilters] = useState<Filters>({
    location: initialLocation,
    minPrice: "",
    maxPrice: "",
    status: "listed",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: listings,
    isPending: isLoading,
    error,
    refetch,
  }: any = useListings({
    search: searchQuery,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };
  const handleListingView = (listingView: "list" | "grid") => {
    setListingView(listingView);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <>
      <Helmet>
        <title>Listings - RapidRent</title>
        <meta
          name="description"
          content="Browse available rental properties on RapidRent. Filter by location, price, and amenities to find your perfect home."
        />
        <link rel="canonical" href="https://rentview.co.uk/listings" />
        <meta property="og:url" content="https://rentview.co.uk/listings" />
      </Helmet>
      <div className="top-10 relative">
        <AddressMap />
        <div className="py-8  max-w-7xl  mx-auto px-4 xl:px-0 ">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold font-plus-jakarta-sans text-text-primary">
              Listings
            </h1>
            <p className="text-slate-400 font-inter text-sm">
              Find your perfect rental property
            </p>
          </div>

          <SearchFilters
            filters={filters}
            listingView={listingView}
            searchQuery={searchQuery}
            onFiltersChange={handleFiltersChange}
            onSearchChange={handleSearchChange}
            onListingViewChange={handleListingView}
          />

          {error && (
            <div className="bg-red-50 border  border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">
                Error loading properties. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-primary hover:text-primary-dark font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {listings?.data?.data?.listings &&
            listings?.data?.data?.listings?.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-muted p-12 text-center">
                <div className="text-text-muted mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0v-3.586a1 1 0 01.293-.707l6.414-6.414a1 1 0 011.414 0l6.414 6.414a1 1 0 01.293.707V21M9 12l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No properties found
                </h3>
                <p className="text-text-muted">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}

          {listings?.data?.data?.listings &&
            listings?.data?.data?.listings?.length > 0 && (
              <div
                className={clsx(
                  "grid  gap-6",
                  listingView === "grid" &&
                    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {listings?.data?.data?.listings?.map((property) => (
                  <PropertyCard
                    listingView={listingView}
                    key={property.id}
                    property={property}
                    showLandlordActions={user?.id === property.landlord_id}
                  />
                ))}
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Listings;

const AddressMap = () => {
  return (
    <div className="google-map-code    overflow-hidden rounded-xl py-8 ">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19801.54672774623!2d-0.1275862!3d51.5072178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
        width="100%"
        height="450"
        style={{ border: 0 }}
        aria-hidden="false"
      />
    </div>
  );
};
