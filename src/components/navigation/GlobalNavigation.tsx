import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { MobileMenuToggle } from "./MobileMenuToggle";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

interface NavigationProps {
  userType?: "tenant" | "landlord";
}

const transparentRoutes = ["/"];

export const GlobalNavigation: React.FC<NavigationProps> = ({ userType }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isTransparentRoute = transparentRoutes.includes(location.pathname);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 0) {
  //       setScrolled(true);
  //     } else {
  //       setScrolled(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    // Disable scroll logic entirely for non-transparent routes
    if (!transparentRoutes.includes(location.pathname)) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Trigger after user scrolls past 80vh
      const threshold = window.innerHeight * 0.7;
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header
      className={clsx(
        ` sticky top-10 z-50     transition-all duration-300`
        // isTransparentRoute
        //   ? scrolled
        //     ? "bg-white/10 backdrop-blur shadow-sm"
        //     : "bg-transparent"
        //   : "bg-white shadow-sm"
      )}
    >
      <div className="max-w-7xl p-2 mx-auto bg-white/60 backdrop-blur shadow rounded-full ">
        <div className="flex items-center justify-between ">
          <Logo
            isTransparentRoute={isTransparentRoute}
            scrolled={scrolled}
            userType={userType}
          />
          <DesktopNavigation
            isTransparentRoute={isTransparentRoute}
            scrolled={scrolled}
            userType={userType}
          />
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onToggle={toggleMobileMenu}
          />
        </div>
        <MobileNavigation
          userType={userType}
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      </div>
    </header>
  );
};
