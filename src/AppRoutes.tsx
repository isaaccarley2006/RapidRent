import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { RenterLayout } from "./layouts/RenterLayout";
import { LandlordLayout } from "./layouts/LandlordLayout";
import { AgentLayout } from "./layouts/AgentLayout";
import Home from "./pages/Home-old";
import Auth from "./pages/Auth";
import EmailConfirmed from "./pages/EmailConfirmed";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import MakeOffer from "./pages/MakeOffer";
import RenterProfile from "./pages/RenterProfile";
import StructuredOffer from "./pages/StructuredOffer";
import CreateListing from "./pages/CreateListing";
import BulkUpload from "./pages/BulkUpload";
import PropertyOffers from "./pages/PropertyOffers";

import AgentDashboard from "./pages/AgentDashboard";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
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
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
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
  );
};

export default AppRoutes;
