import React, { useState, useEffect } from "react";
import { PoundSterling, Home, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/auth/useUser";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  price: number | null;
  status: string;
  createdAt: string;
  landlord_id: string;
}

interface LandlordProfile {
  full_name: string | null;
}

interface PropertySidebarProps {
  property: Property;
  onMakeOffer: () => void;
}

export const PropertySidebar: React.FC<PropertySidebarProps> = ({
  property,
  onMakeOffer,
}) => {
  const { user } = useAuth();
  const { profile } = useUser();
  const [landlordProfile, setLandlordProfile] =
    useState<LandlordProfile | null>(null);
  const [propertiesCount, setPropertiesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        // Fetch landlord profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", property.landlord_id)
          .maybeSingle();

        // Fetch landlord's property count
        const { count } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("landlord_id", property.landlord_id);

        setLandlordProfile(profile);
        setPropertiesCount(count || 0);
      } catch (error) {
        console.error("Error fetching landlord data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordData();
  }, [property.landlord_id]);

  const getInitials = (name: string | null) => {
    if (!name) return "LL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-text-primary">
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Rent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PoundSterling className="w-5 h-5 text-primary mr-2" />
            <span className="text-text-muted">Monthly Rent</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">
            {property.price
              ? `£${Math.round(property.price).toLocaleString()}`
              : "Price on request"}
          </span>
        </div>

        {/* Property Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Home className="w-5 h-5 text-primary mr-2" />
            <span className="text-text-muted">Property Type</span>
          </div>
          <span className="text-text-primary font-medium">Rental Property</span>
        </div>

        {/* Listed Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-primary mr-2" />
            <span className="text-text-muted">Listed</span>
          </div>
          <span className="text-text-primary font-medium">
            {new Date(property.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-6 border-t border-muted">
          {profile?.role === "landlord" ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                You cannot make offers as a landlord
              </p>
              <Button variant="outline" className="w-full" disabled>
                Landlord Account
              </Button>
            </div>
          ) : (
            <Button
              onClick={onMakeOffer}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              disabled={property.status !== "listed"}
            >
              {user ? "Make an Offer" : "Sign in to Make an Offer"}
            </Button>
          )}

          {property.status !== "listed" && (
            <p className="text-sm text-text-muted text-center mt-2">
              This property is no longer available for offers
            </p>
          )}
        </div>

        {/* Landlord Information */}
        <div className="pt-6 border-t border-muted">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Landlord Information
          </h3>

          {loading ? (
            <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-4">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {getInitials(landlordProfile?.full_name)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {landlordProfile?.full_name || "Property Owner"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Property Owner
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-500">{"★".repeat(5)}</div>
                    <span className="text-sm font-medium text-foreground">
                      4.8
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Response Time
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Within 2 hours
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Properties Listed
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {propertiesCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
