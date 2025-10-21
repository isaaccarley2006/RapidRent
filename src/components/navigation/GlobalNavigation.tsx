import React, { useState } from "react";
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { MobileMenuToggle } from "./MobileMenuToggle";

interface NavigationProps {
  userType?: "tenant" | "landlord";
}

export const GlobalNavigation: React.FC<NavigationProps> = ({ userType }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-muted shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo userType={userType} />
          <DesktopNavigation userType={userType} />
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
