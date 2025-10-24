import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { RenterLayout } from "./layouts/RenterLayout";
import { LandlordLayout } from "./layouts/LandlordLayout";
import { AgentLayout } from "./layouts/AgentLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import TenantAuth from "./pages/TenantAuth";
import AgentAuth from "./pages/AgentAuth";
import EmailConfirmed from "./pages/EmailConfirmed";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import MakeOffer from "./pages/MakeOffer";
import RenterProfile from "./pages/RenterProfile";
import TenantCommunities from "./pages/TenantCommunities";
import CommunityProfileDetail from "./pages/CommunityProfileDetail";
import StructuredOffer from "./pages/StructuredOffer";
import CreateListing from "./pages/CreateListing";
import BulkUpload from "./pages/BulkUpload";
import PropertyOffers from "./pages/PropertyOffers";
import AgentDashboard from "@/pages/AgentDashboard";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";
import CookiePolicy from "@/pages/CookiePolicy";
import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import NewProfile from "@/pages/NewProfile";
import About from "@/pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error) => {
        if (failureCount < 2) return true;
        return false;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: "always",
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <TooltipProvider>
            <AuthProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <Home />
                    </AppLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <AppLayout>
                      <About />
                    </AppLayout>
                  }
                />

                <Route
                  path="/listings"
                  element={
                    <AppLayout>
                      <Listings />
                    </AppLayout>
                  }
                />
                <Route
                  path="/properties/:id"
                  element={
                    <AppLayout>
                      <PropertyDetails />
                    </AppLayout>
                  }
                />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/tenant" element={<TenantAuth />} />
                <Route path="/auth/agent" element={<AgentAuth />} />
                <Route path="/confirmed" element={<EmailConfirmed />} />
                {/* Role-based protected routes */}
                <Route
                  path="/renter/*"
                  element={
                    <RenterLayout>
                      <Routes>
                        <Route path="profile" element={<RenterProfile />} />
                        <Route
                          path="*"
                          element={<Navigate to="/renter/profile" replace />}
                        />
                      </Routes>
                    </RenterLayout>
                  }
                />
                <Route
                  path="/landlord/*"
                  element={
                    <LandlordLayout>
                      <Routes>
                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" replace />}
                        />
                      </Routes>
                    </LandlordLayout>
                  }
                />
                <Route
                  path="/agent/*"
                  element={
                    <AgentLayout>
                      <Routes>
                        <Route path="dashboard" element={<AgentDashboard />} />
                        <Route
                          path="*"
                          element={<Navigate to="/agent/dashboard" replace />}
                        />
                      </Routes>
                    </AgentLayout>
                  }
                />
                {/* General protected routes */}
                <Route
                  path="/onboarding"
                  element={
                    // <ProtectedRoute>
                    <Onboarding />
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                {/* Redirect old dashboard routes */}
                <Route
                  path="/dashboard/tenant"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/dashboard/landlord"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/new-profile"
                  element={
                    <AppLayout>
                      <NewProfile />
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  }
                />
                <Route
                  path="/renter/profile"
                  element={
                    <ProtectedRoute>
                      <RenterProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenant/communities"
                  element={
                    <ProtectedRoute>
                      <RenterLayout>
                        <TenantCommunities />
                      </RenterLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenant/communities/:profileId"
                  element={
                    <ProtectedRoute>
                      <RenterLayout>
                        <CommunityProfileDetail />
                      </RenterLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listing/:id/offer"
                  element={
                    <ProtectedRoute>
                      <StructuredOffer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/offers/new/:propertyId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MakeOffer />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Redirect old listings route */}
                <Route
                  path="/listings/new"
                  element={<Navigate to="/create-listing" replace />}
                />
                <Route
                  path="/create-listing"
                  element={
                    <ProtectedRoute>
                      <CreateListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bulk-upload"
                  element={
                    <ProtectedRoute>
                      <BulkUpload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/property/:propertyId/offers"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PropertyOffers />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Legal Pages */}
                <Route
                  path="/legal/privacy"
                  element={
                    <AppLayout>
                      <PrivacyPolicy />
                    </AppLayout>
                  }
                />
                <Route
                  path="/legal/terms"
                  element={
                    <AppLayout>
                      <TermsOfService />
                    </AppLayout>
                  }
                />
                <Route
                  path="/legal/cookies"
                  element={
                    <AppLayout>
                      <CookiePolicy />
                    </AppLayout>
                  }
                />
                <Route
                  path="*"
                  element={
                    <AppLayout>
                      <NotFound />
                    </AppLayout>
                  }
                />
              </Routes>
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
