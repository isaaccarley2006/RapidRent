import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";
import { IMAGES } from "@/assets";

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
    navigate("/");
    // if (user) {
    //   // For authenticated users, logo takes them to dashboard
    //   navigate(getDashboardPath());
    // } else {
    //   // For unauthenticated users, logo takes them to home
    //   navigate("/");
    // }
  };

  return (
    <div
      className={clsx(
        `text-2xl font-bold  ml-4 cursor-pointer flex items-center gap-2`
        // isTransparentRoute && !scrolled ? "text-white" : "text-text-primary"
      )}
      onClick={handleLogoClick}
    >
      <img
        className="w-6 -mt-1"
        src={
          // isTransparentRoute && !scrolled
          //   ? IMAGES.LOGO_WHITE
          IMAGES.LOGO_PRIMARY
        }
      />
      <div className=" font-semibold">
        Rapid<span className="text-primary">Rent</span>
      </div>
    </div>
  );
};
