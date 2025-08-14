
import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layouts/AppLayout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import EmailConfirmed from './pages/EmailConfirmed'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Listings from './pages/Listings'
import PropertyDetails from './pages/PropertyDetails'
import MakeOffer from './pages/MakeOffer'
import RenterProfile from './pages/RenterProfile'
import StructuredOffer from './pages/StructuredOffer'
import CreateListing from './pages/CreateListing'
import PropertyOffers from './pages/PropertyOffers'
import LandlordOffers from './pages/LandlordOffers'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/listings" element={<AppLayout><Listings /></AppLayout>} />
            <Route path="/properties/:id" element={<AppLayout><PropertyDetails /></AppLayout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/confirmed" element={<EmailConfirmed />} />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
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
            <Route path="/dashboard/tenant" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/landlord" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <AppLayout><Profile /></AppLayout>
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
                  <AppLayout><MakeOffer /></AppLayout>
                </ProtectedRoute>
              } 
            />
            {/* Redirect old listings route */}
            <Route path="/listings/new" element={<Navigate to="/create-listing" replace />} />
            <Route 
              path="/create-listing" 
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property/:propertyId/offers" 
              element={
                <ProtectedRoute>
                  <AppLayout><PropertyOffers /></AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/landlord/offers" 
              element={
                <ProtectedRoute>
                  <LandlordOffers />
                </ProtectedRoute>
              } 
            />
            
            {/* Legal Pages */}
            <Route path="/legal/privacy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
            <Route path="/legal/terms" element={<AppLayout><TermsOfService /></AppLayout>} />
            <Route path="/legal/cookies" element={<AppLayout><CookiePolicy /></AppLayout>} />
            
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
)

export default App
