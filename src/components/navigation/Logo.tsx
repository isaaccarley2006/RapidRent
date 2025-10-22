import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

interface LogoProps {
  userType?: "tenant" | "landlord";
  scrolled?: boolean;
  isTransparentRoute?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  userType,
  scrolled,
  isTransparentRoute,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    return userType ? `/dashboard/${userType}` : "/dashboard";
  };

  const handleLogoClick = () => {
    if (user) {
      // For authenticated users, logo takes them to dashboard
      navigate(getDashboardPath());
    } else {
      // For unauthenticated users, logo takes them to home
      navigate("/");
    }
  };

  return (
    <div
      className={clsx(
        `text-2xl font-bold  cursor-pointer`,
        isTransparentRoute && !scrolled ? "text-white" : "text-text-primary"
      )}
      onClick={handleLogoClick}
    >
      Rapid<span className="text-primary">Rent</span>
    </div>
  );
};
