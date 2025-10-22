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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        `sticky top-0 z-50 shadow-sm transition-all duration-300`,
        isTransparentRoute
          ? scrolled
            ? "bg-white/10 backdrop-blur"
            : "bg-transparent"
          : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
