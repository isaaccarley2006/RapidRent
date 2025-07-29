import React from 'react';
import { NavigationWrapper } from '@/components/navigation/NavigationWrapper';
import { useLocation } from 'react-router-dom';
interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNavigation
}) => {
  const location = useLocation();

  // Determine if navigation should be shown based on route
  const shouldShowNavigation = showNavigation !== false && !location.pathname.startsWith('/auth');
  return <div className="min-h-screen font-sans bg-transparent">
      {shouldShowNavigation && <NavigationWrapper />}
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>;
};