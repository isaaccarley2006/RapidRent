import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PropertyPageHeader } from "@/components/property/PropertyPageHeader";
import { PropertyImage } from "@/components/property/PropertyImage";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { PropertySidebar } from "@/components/property/PropertySidebar";
import { track } from "@/lib/analytics";
import { useUser } from "@/lib/auth/useUser";
import { useSpecificListing } from "@/hooks/useListings";

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

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: authUser, profile } = useUser();
  const {
    data: _property,
    isPending: isLoading,
    refetch,
    error,
  }: any = useSpecificListing({ id });

  const property = {
    title: _property?.data?.data?.title,
    description: _property?.data?.data?.description,
    images: _property?.data?.data?.images,
    location: _property?.data?.data?.location,
    status: "listed",

    id: _property?.data?.data?.id,
    price: _property?.data?.data?.monthlyRent,
    createdAt: _property?.data?.data?.createdAt,
    landlord_id: _property?.data?.data?.agencyId,
    // property?.data?.data
  };
  // const fetchProperty = async (): Promise<Property> => {
  //   if (!id) throw new Error("Property ID is required");

  //   const { data, error } = await supabase
  //     .from("properties")
  //     .select("*, bedrooms, bathrooms, furnished, property_type, images")
  //     .eq("id", id)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching property:", error);
  //     throw error;
  //   }

  //   return data;
  // };

  // const {
  //   data: property,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["property", id],
  //   queryFn: fetchProperty,
  //   enabled: !!id,
  // });

  const handleBackToListings = () => {
    navigate("/listings");
  };

  const handleMakeOffer = () => {
    if (user) {
      track("offer_started", {
        listing_id: id,
        user_id: authUser?.id,
        role: profile?.role,
      });
      navigate(`/listing/${id}/offer`);
    } else {
      navigate("/auth");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Property Not Found
            </h1>
            <p className="text-text-muted mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={handleBackToListings}
              variant="outline"
              className="bg-primary text-white hover:bg-primary-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {property?.title
            ? `${property.title} - RapidRent`
            : "Property Details - RapidRent"}
        </title>
        <meta
          name="description"
          content={
            property?.description ||
            "View detailed information about this rental property on RapidRent."
          }
        />
        <link
          rel="canonical"
          href={`https://rentview.co.uk/properties/${id}`}
        />
        <meta
          property="og:url"
          content={`https://rentview.co.uk/properties/${id}`}
        />
        <meta
          property="og:title"
          content={
            property?.title
              ? `${property.title} - RapidRent`
              : "Property Details - RapidRent"
          }
        />
        <meta
          property="og:description"
          content={
            property?.description ||
            "View detailed information about this rental property on RapidRent."
          }
        />
      </Helmet>
      <div className="min-h-screen bg-background font-sans">
        <PropertyPageHeader />

        <div className="max-w-7xl mx-auto  py-12">
          <PropertyImage images={property.images || []} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                <PropertyHeader
                  title={property.title}
                  location={property.location}
                  status={property.status}
                />
              </div>

              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                <PropertyDescription description={property.description} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <PropertySidebar
                  property={property}
                  onMakeOffer={handleMakeOffer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
