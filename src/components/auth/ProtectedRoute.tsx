import React from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, user } = useAuthRedirect();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
