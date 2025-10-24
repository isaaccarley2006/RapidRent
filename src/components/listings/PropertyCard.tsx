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
import { PiClockLight } from "react-icons/pi";
import clsx from "clsx";

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
  const isUserHave = Boolean(user?.id);

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
        isUserHave={isUserHave}
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
      isUserHave={isUserHave}
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
  isUserHave,
}) => {
  return (
    <Card className="hover:shadow relative transition-shadow duration-200 rounded-2xl cursor-pointer bg-white">
      <CardContent className="space-y-4 p-4 pt-0">
        <div className=" absolute top-6 z-10 right-6   bottom-0">
          <StatusBadge status={"listed"} />
        </div>
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

        <CardTitle className="text-xl font-semibold text-text-primary">
          {property.title.length > 30
            ? `${property.title.substring(0, 30)}...`
            : property.title}
        </CardTitle>
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
          isUserHave={isUserHave}
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
  isUserHave,
}) => {
  return (
    <Card className="hover:shadow relative grid grid-cols-2 gap-8 transition-shadow duration-200 p-4 rounded-2xl cursor-pointer bg-white">
      <div className="space-y-4">
        <div className="relative h-full  bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src={property.images?.[0] || ""}
            alt={property.title}
            className="w-full h-full absolute top-0 right-0 left-0 bottom-0 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
        </div>
      </div>
      <div className="py-4  flex font-inter">
        <div className="flex flex-1 w-full flex-col items-start">
          <div className="w-full flex-1">
            <div className="mb-2">
              <div className="text-xs text-text-muted font-inter">
                Monthly Price
              </div>
              <div className="flex items-center">
                {/* <PoundSterling className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> */}
                <span className="text-2xl text-text-primary">
                  {property.monthlyRent
                    ? `£${Math.round(property.monthlyRent).toLocaleString()}`
                    : "Price on request"}
                </span>
              </div>
            </div>
            <div className="mb-8">
              <div className="text-xl font-medium  text-text-primary">
                {property.title.length > 30
                  ? `${property.title.substring(0, 30)}...`
                  : property.title}
              </div>
              <div className="flex items-center text-sm  text-text-muted">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {formatLocationDisplay(property.location)}
                </span>
              </div>
            </div>
            <PropertiesDetails property={property} />
          </div>
          <div className="w-full">
            <PropertyActionButtons
              showLandlordActions={showLandlordActions}
              isOwner={isOwner}
              handleEdit={handleEdit}
              isUserHave={isUserHave}
              handleViewOffers={handleViewOffers}
              handleViewDetails={handleViewDetails}
            />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <StatusBadge status={"listed"} />
        </div>
      </div>
    </Card>
  );
};

const PropertiesDetails = ({ property }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4 w-full text-sm">
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
  isUserHave,
}) => {
  return (
    <div
      className={clsx(
        "w-full gap-2  pt-4 border-t border-gray-100  grid  items-center",
        isUserHave && "grid-cols-3"
      )}
    >
      <Button
        onClick={handleViewDetails}
        className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl"
      >
        View Details
      </Button>

      {/* isUserHave && showLandlordActions && isOwner && */}
      {isUserHave && (
        <>
          <Button
            onClick={handleEdit}
            variant="outline"
            className="flex w-full items-center"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </Button>
          <Button
            onClick={handleViewOffers}
            variant="outline"
            className="flex w-full items-center"
          >
            <Eye className="w-3 h-3" />
            Offers
          </Button>
        </>
      )}
    </div>
  );
};
