import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedAuth } from "./useOptimizedAuth";

export const useAuthRedirect = () => {
  const { user, session, loading: authLoading } = useAuth();
  const {
    profile,
    loading: profileLoading,
    createProfile,
  } = useOptimizedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    const handleRedirect = async () => {
      const currentPath = location.pathname;
      setRedirecting(true);

      // If not logged in, redirect to auth (except if already on auth page)
      if (!user || !session) {
        const authRoutes = ["/auth", "/auth/tenant", "/auth/agent"];
        if (!authRoutes.includes(currentPath)) {
          navigate("/auth/tenant", { replace: true }); // Default to tenant auth
        }
        setRedirecting(false);
        return;
      }

      try {
        // If profile doesn't exist, create one and redirect to dashboard
        if (!profile) {
          await createProfile({
            email: user.email,
            profile_complete: true,
          });

          if (currentPath !== "/dashboard") {
            navigate("/dashboard", { replace: true });
          }
          setRedirecting(false);
          return;
        }

        // Redirect authenticated users based on their role
        const authRoutes = ["/auth", "/auth/tenant", "/auth/agent"];
        if (
          authRoutes.includes(currentPath) ||
          currentPath === "/onboarding" ||
          currentPath === "/"
        ) {
          // Route based on user type
          if (profile.user_type === "agent") {
            navigate("/profile", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error in auth redirect logic:", error);
        // If any error occurs, redirect to onboarding to be safe
        if (currentPath !== "/onboarding") {
          navigate("/onboarding", { replace: true });
        }
      } finally {
        setRedirecting(false);
      }
    };

    // Debounce the redirect to prevent rapid successive calls
    const timeoutId = setTimeout(handleRedirect, 100);
    return () => clearTimeout(timeoutId);
  }, [
    user,
    session,
    authLoading,
    profileLoading,
    profile,
    navigate,
    location.pathname,
    createProfile,
  ]);

  return {
    loading: authLoading || profileLoading || redirecting,
    user,
    session,
  };
};
