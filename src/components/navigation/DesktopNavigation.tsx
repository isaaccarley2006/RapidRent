import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

interface DesktopNavigationProps {
  userType?: "tenant" | "landlord";
  scrolled?: boolean;
  isTransparentRoute?: boolean;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  userType,
  scrolled,
  isTransparentRoute,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActivePath = (path: string) => {
    if (path === "/dashboard" && userType) {
      return location.pathname === `/dashboard/${userType}`;
    }
    return location.pathname === path;
  };

  const getDashboardPath = () => {
    return userType ? `/dashboard/${userType}` : "/dashboard";
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {user ? (
        <>
          {/* Authenticated User Links - No Home button */}
          <button
            onClick={() => navigate(getDashboardPath())}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath("/dashboard")
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/listings")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath("/listings")
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }`}
          >
            {userType === "landlord" ? "Listings" : "Properties"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath("/profile")
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }`}
          >
            Profile
          </button>

          {userType === "tenant" && (
            <button
              onClick={() => navigate("/tenant/communities")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActivePath("/tenant/communities")
                  ? "text-primary font-semibold"
                  : "text-text-primary hover:text-primary"
              }`}
            >
              Communities
            </button>
          )}

          {userType === "landlord" && (
            <button
              onClick={() => navigate("/create-listing")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActivePath("/create-listing")
                  ? "text-primary font-semibold"
                  : "text-text-primary hover:text-primary"
              }`}
            >
              Create Listing
            </button>
          )}

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-muted text-text-primary hover:bg-surface rounded-xl"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          {/* Public User Links */}

          {[
            {
              label: "Home",
              link: "/",
            },
            {
              label: "About Us",
              link: "/about",
            },
            {
              label: "Listing",
              link: "/listings",
            },
          ].map((link, index) => {
            return (
              <button
                key={index}
                onClick={() => navigate(link.link)}
                className={clsx(
                  `px-3 py-2 text-sm font-medium transition-colors`,

                  isActivePath(link.link)
                    ? "text-primary font-semibold"
                    : isTransparentRoute && !scrolled
                    ? "text-white"
                    : "text-text-primary hover:text-primary"
                )}
              >
                {link.label}
              </button>
            );
          })}

          <Button onClick={() => navigate("/listings")} className=" rounded-xl">
            Login In
          </Button>
        </>
      )}
    </nav>
  );
};
