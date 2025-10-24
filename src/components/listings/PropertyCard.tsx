import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  MapPin,
  PoundSterling,
  Bed,
  Bath,
  Home,
  Check,
  X,
  Edit2,
  Eye,
} from "lucide-react";
import { StatusBadge } from "@/components/property/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { formatLocationDisplay } from "@/utils/locationFormatter";

interface Property {
  id: string;
  title: string;
  description: string | null;
  monthlyRent: number | null;
  location: string | null;
  status: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: boolean;
  propertyType: string | null;
  images?: string[];
}

interface PropertyCardProps {
  property: Property;
  showLandlordActions?: boolean;
  listingView?: "list" | "grid";
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showLandlordActions = false,
  listingView,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.id === property.landlord_id;

  const handleViewDetails = () => {
    navigate(`/properties/${property.id}`);
  };

  const handleEdit = () => {
    navigate(`/create-listing?edit=${property.id}`);
  };

  const handleViewOffers = () => {
    navigate(`/dashboard?tab=offers&property=${property.id}`);
  };

  if (listingView == "list") {
    return (
      <HorizontalCard
        handleEdit={handleEdit}
        property={property}
        showLandlordActions={showLandlordActions}
        handleViewDetails={handleViewDetails}
        isOwner={isOwner}
        handleViewOffers={handleViewOffers}
      />
    );
  }
  return (
    <GridCard
      handleEdit={handleEdit}
      property={property}
      showLandlordActions={showLandlordActions}
      handleViewDetails={handleViewDetails}
      isOwner={isOwner}
      handleViewOffers={handleViewOffers}
    />
  );
};

const GridCard = ({
  handleEdit,
  property,
  showLandlordActions,
  handleViewDetails,
  isOwner,
  handleViewOffers,
}) => {
  return (
    <Card className="hover:shadow transition-shadow duration-200 cursor-pointer bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-text-primary min-h-[3.5rem] leading-relaxed">
            {property.title.length > 30
              ? `${property.title.substring(0, 30)}...`
              : property.title}
          </CardTitle>
          <StatusBadge status={"listed"} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Image with Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src={property.images?.[0] || ""}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  target.parentElement!.innerHTML =
                    '<div class="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg flex items-center justify-center"><svg class="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img
              src={property.images?.[0] || ""}
              alt={property.title}
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                target.parentElement!.innerHTML =
                  '<div class="w-full h-auto max-h-[80vh] bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg flex items-center justify-center p-12"><svg class="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>';
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Location */}
        <div className="flex items-center text-text-muted">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {formatLocationDisplay(property.location)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <PoundSterling className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
          <span className="text-base font-semibold text-text-primary">
            {property.monthlyRent
              ? `£${Math.round(property.monthlyRent).toLocaleString()}/month`
              : "Price on request"}
          </span>
        </div>

        <PropertiesDetails property={property} />
        <PropertyActionButtons
          showLandlordActions={showLandlordActions}
          isOwner={isOwner}
          handleEdit={handleEdit}
          handleViewOffers={handleViewOffers}
          handleViewDetails={handleViewDetails}
        />
      </CardContent>
    </Card>
  );
};

const HorizontalCard = ({
  handleEdit,
  property,
  showLandlordActions,
  handleViewDetails,
  isOwner,
  handleViewOffers,
}) => {
  return (
    <Card className="hover:shadow flex gap-4 transition-shadow duration-200 p-2 rounded-xl cursor-pointer bg-white">
      <div className="space-y-4">
        <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src={property.images?.[0] || ""}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
        </div>
      </div>
      <div className="pb-3 flex flex-1">
        <div className="flex flex-1 w-full flex-col items-start">
          <div>
            <div>Monthly Price</div>
            <div className="flex items-center">
              <PoundSterling className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
              <span className="text-base font-semibold text-text-primary">
                {property.monthlyRent
                  ? `£${Math.round(property.monthlyRent).toLocaleString()}`
                  : "Price on request"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium font-inter text-text-primary leading-relaxed">
              {property.title.length > 30
                ? `${property.title.substring(0, 30)}...`
                : property.title}
            </div>
            <div className="flex items-center text-text-muted">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {formatLocationDisplay(property.location)}
              </span>
            </div>
          </div>
          <PropertiesDetails property={property} />
          <PropertyActionButtons
            showLandlordActions={showLandlordActions}
            isOwner={isOwner}
            handleEdit={handleEdit}
            handleViewOffers={handleViewOffers}
            handleViewDetails={handleViewDetails}
          />
        </div>
        <div>
          <StatusBadge status={"listed"} />
        </div>
      </div>
    </Card>
  );
};

const PropertiesDetails = ({ property }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 w-full text-sm">
        <div className="flex items-center">
          <Bed className="w-4 h-4 mr-2 text-primary" />
          <span className="text-text-muted">
            {property.bedrooms === 0
              ? "Studio"
              : `${property.bedrooms || 0} Bedroom${
                  (property.bedrooms || 0) !== 1 ? "s" : ""
                }`}
          </span>
        </div>

        <div className="flex items-center">
          <Bath className="w-4 h-4 mr-2 text-primary" />
          <span className="text-text-muted">
            {property.bathrooms || 0} Bathroom
            {(property.bathrooms || 0) !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center">
          <Home className="w-4 h-4 mr-2 text-primary" />
          <span className="text-text-muted">
            {property.propertyType || "Property"}
          </span>
        </div>

        <div className="flex items-center">
          {property.furnished ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <X className="w-4 h-4 mr-2 text-red-500" />
          )}
          <span className="text-text-muted">
            {property.furnished ? "Furnished" : "Unfurnished"}
          </span>
        </div>
      </div>
    </>
  );
};

const PropertyActionButtons = ({
  handleViewDetails,
  showLandlordActions,
  isOwner,
  handleEdit,
  handleViewOffers,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Button
        onClick={handleViewDetails}
        className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl"
      >
        View Details
      </Button>

      {showLandlordActions && isOwner && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </Button>
          <Button
            onClick={handleViewOffers}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Offers
          </Button>
        </div>
      )}
    </div>
  );
};
